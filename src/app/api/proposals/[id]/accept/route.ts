import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const body = await request.json().catch(() => ({}));
  const token = body.token ?? request.headers.get('x-proposal-token');
  const isPublic = !!token;

  if (!user && !isPublic) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let q = supabase.from('proposals').select('*').eq('id', id);
  if (isPublic) {
    q = q.eq('public_slug', token);
  } else {
    q = q.eq('user_id', user!.id);
  }
  const { data: proposal, error: fetchError } = await q.single();
  if (fetchError || !proposal) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (proposal.status !== 'sent' && proposal.status !== 'draft') {
    return NextResponse.json({ error: 'Proposal cannot be accepted' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('proposals')
    .update({ status: 'accepted', updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('public_slug', proposal.public_slug)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
