import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateSlug } from '@/lib/slug';
import { proposalSchema } from '@/lib/validation';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parseResult = proposalSchema.safeParse(await request.json());
  if (!parseResult.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parseResult.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { client_id, title, valid_until, items } = parseResult.data;

  const total_cents = items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price_cents,
    0
  );

  let publicSlug: string | null = null;
  for (let i = 0; i < 5; i++) {
    const slug = generateSlug();
    const { data: existing } = await supabase
      .from('proposals')
      .select('id')
      .eq('public_slug', slug)
      .single();
    if (!existing) {
      publicSlug = slug;
      break;
    }
  }

  const { data: proposal, error: propError } = await supabase
    .from('proposals')
    .insert({
      user_id: user.id,
      client_id,
      title,
      status: 'draft',
      total_cents,
      valid_until: valid_until || null,
      public_slug: publicSlug,
    })
    .select()
    .single();

  if (propError) {
    return NextResponse.json({ error: propError.message }, { status: 500 });
  }

  if (items.length) {
    const rows = items.map((item, i) => ({
      proposal_id: proposal.id,
      description: item.description,
      quantity: item.quantity,
      unit_price_cents: item.unit_price_cents,
      sort_order: i,
    }));
    const { error: itemsError } = await supabase
      .from('proposal_items')
      .insert(rows);
    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }
  }

  const { data: full } = await supabase
    .from('proposals')
    .select('*, items:proposal_items(*)')
    .eq('id', proposal.id)
    .single();

  return NextResponse.json(full ?? proposal);
}
