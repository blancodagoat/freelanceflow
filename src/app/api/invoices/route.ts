import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { invoiceSchema } from '@/lib/validation';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parseResult = invoiceSchema.safeParse(await request.json());
  if (!parseResult.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parseResult.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { client_id, proposal_id, contract_id, due_date, items } = parseResult.data;

  const total_cents = items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price_cents,
    0
  );

  const { data: lastInv } = await supabase
    .from('invoices')
    .select('invoice_number')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const nextNum = lastInv?.invoice_number
    ? String(Number(lastInv.invoice_number.replace(/\D/g, '')) + 1)
    : '1';
  const invoice_number = `INV-${nextNum.padStart(5, '0')}`;

  const { data: invoice, error: invError } = await supabase
    .from('invoices')
    .insert({
      user_id: user.id,
      client_id,
      proposal_id: proposal_id || null,
      contract_id: contract_id || null,
      invoice_number,
      total_cents,
      status: 'draft',
      due_date: due_date || null,
    })
    .select()
    .single();

  if (invError) {
    return NextResponse.json({ error: invError.message }, { status: 500 });
  }

  if (items.length) {
    const rows = items.map((item, i) => ({
      invoice_id: invoice.id,
      description: item.description,
      quantity: item.quantity,
      unit_price_cents: item.unit_price_cents,
      sort_order: i,
    }));
    await supabase.from('invoice_items').insert(rows);
  }

  const { data: full } = await supabase
    .from('invoices')
    .select('*, items:invoice_items(*)')
    .eq('id', invoice.id)
    .single();

  return NextResponse.json(full ?? invoice);
}
