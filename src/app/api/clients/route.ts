import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { clientSchema } from '@/lib/validation';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parseResult = clientSchema.safeParse(await request.json());
  if (!parseResult.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parseResult.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { name, email, company } = parseResult.data;

  const { data, error } = await supabase
    .from('clients')
    .insert({ user_id: user.id, name, email, company: company ?? null })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
