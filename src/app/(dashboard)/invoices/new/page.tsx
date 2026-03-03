import { createClient } from '@/lib/supabase/server';
import InvoiceForm from '@/components/InvoiceForm';
import Link from 'next/link';

export default async function NewInvoicePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [clientsRes, contractsRes] = await Promise.all([
    supabase.from('clients').select('id, name, email').eq('user_id', user.id).order('name'),
    supabase.from('contracts').select('id, title, client_id, proposal:proposals(id, total_cents, items:proposal_items(*))').eq('user_id', user.id).eq('status', 'signed'),
  ]);

  const clients = clientsRes.data ?? [];
  const rawContracts = contractsRes.data ?? [];
  type RawC = { id: string; title: string; client_id: string; proposal?: unknown };
  const contracts = rawContracts.map((c: RawC) => ({
    id: c.id,
    title: c.title,
    client_id: c.client_id,
    proposal: Array.isArray(c.proposal) ? c.proposal[0] : c.proposal,
  })) as { id: string; title: string; client_id: string; proposal?: { id: string; total_cents: number; items?: Array<{ description: string; quantity: number; unit_price_cents: number }> } }[];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">New invoice</h1>
        <Link href="/invoices" className="text-sm text-neutral-600 hover:underline">
          Back to invoices
        </Link>
      </div>
      <InvoiceForm clients={clients} contracts={contracts} />
    </div>
  );
}
