import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  return key ? new Stripe(key) : null;
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: invoice, error: invError } = await supabase
    .from('invoices')
    .select('*, client:clients(email, name)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (invError || !invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  if (invoice.stripe_payment_link_url) {
    return NextResponse.json({ url: invoice.stripe_payment_link_url, payment_link_id: invoice.stripe_payment_link_id });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 503 });
  }

  const amountCents = Number(invoice.total_cents);

  const paymentLink = await stripe.paymentLinks.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Invoice ${invoice.invoice_number}`,
            description: `Payment for invoice ${invoice.invoice_number}`,
          },
          unit_amount: amountCents,
        },
        quantity: 1,
      },
    ],
    metadata: { invoice_id: id, user_id: user.id },
    after_completion: {
      type: 'redirect',
      redirect: { url: `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/invoices/${id}?paid=1` },
    },
  });

  await supabase
    .from('invoices')
    .update({
      stripe_payment_link_id: paymentLink.id,
      stripe_payment_link_url: paymentLink.url,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id);

  return NextResponse.json({ url: paymentLink.url, payment_link_id: paymentLink.id });
}
