import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { contractSchema } from '@/lib/validation';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parseResult = contractSchema.safeParse(await request.json());
  if (!parseResult.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parseResult.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { proposal_id, title } = parseResult.data;

  const { data: proposal } = await supabase
    .from('proposals')
    .select('client_id')
    .eq('id', proposal_id)
    .eq('user_id', user.id)
    .single();

  if (!proposal) return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });

  const { data, error } = await supabase
    .from('contracts')
    .insert({
      user_id: user.id,
      proposal_id,
      client_id: proposal.client_id,
      title,
      status: 'draft',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
