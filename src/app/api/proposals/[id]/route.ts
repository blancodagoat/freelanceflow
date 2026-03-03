import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { proposalUpdateSchema } from '@/lib/validation';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('proposals')
    .select('*, client:clients(*), items:proposal_items(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(data);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parseResult = proposalUpdateSchema.safeParse(await request.json());
  if (!parseResult.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parseResult.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { title, status, valid_until, items } = parseResult.data;

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (title !== undefined) updates.title = title;
  if (status !== undefined) updates.status = status;
  if (valid_until !== undefined) updates.valid_until = valid_until || null;

  if (items !== undefined) {
    const total_cents = items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price_cents,
      0
    );
    updates.total_cents = total_cents;

    const { error: deleteError } = await supabase
      .from('proposal_items')
      .delete()
      .eq('proposal_id', id);
    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }
    if (items.length) {
      const rows = items.map((item, i) => ({
        proposal_id: id,
        description: item.description,
        quantity: item.quantity,
        unit_price_cents: item.unit_price_cents,
        sort_order: i,
      }));
      const { error: insertError } = await supabase
        .from('proposal_items')
        .insert(rows);
      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }
  }

  const { data, error } = await supabase
    .from('proposals')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
