import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import InvoiceActions from '@/components/InvoiceActions';

export default async function InvoicePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ paid?: string }> }) {
  const { id } = await params;
  const { paid } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: invoice } = await supabase
    .from('invoices')
    .select('*, client:clients(*), items:invoice_items(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!invoice) notFound();

  const client = invoice.client as { name: string; email: string; company?: string } | null;
  const items = (invoice.items ?? []) as Array<{ description: string; quantity: number; unit_price_cents: number }>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/invoices" className="text-sm text-neutral-600 hover:underline mb-2 inline-block">
            Back to invoices
          </Link>
          <h1 className="text-2xl font-semibold">{invoice.invoice_number}</h1>
        </div>
        <InvoiceActions invoice={invoice} />
      </div>

      {paid === '1' && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
          Payment completed. You can mark this invoice as paid if it was not updated automatically.
        </div>
      )}

      <div className="bg-white border border-neutral-200 rounded-lg p-6 space-y-6">
        <div>
          <p className="text-sm text-neutral-500 mb-1">Bill to</p>
          <p className="font-medium">{client?.name}</p>
          <p className="text-neutral-600">{client?.email}</p>
          {client?.company && <p className="text-neutral-600">{client.company}</p>}
        </div>
        <div>
          <p className="text-sm text-neutral-500 mb-2">Status</p>
          <span className="inline-block px-2 py-1 rounded text-sm font-medium bg-neutral-100">
            {invoice.status}
          </span>
          {invoice.paid_at && (
            <p className="text-sm text-neutral-500 mt-1">Paid at {new Date(invoice.paid_at).toLocaleString()}</p>
          )}
        </div>
        <div>
          <p className="text-sm text-neutral-500 mb-2">Due date</p>
          <p>{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '—'}</p>
        </div>
        <div>
          <p className="text-sm text-neutral-500 mb-2">Line items</p>
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left text-sm font-medium text-neutral-600 py-2">Description</th>
                <th className="text-right text-sm font-medium text-neutral-600 py-2">Qty</th>
                <th className="text-right text-sm font-medium text-neutral-600 py-2">Unit price</th>
                <th className="text-right text-sm font-medium text-neutral-600 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b border-neutral-100">
                  <td className="py-2">{item.description}</td>
                  <td className="text-right py-2">{item.quantity}</td>
                  <td className="text-right py-2">${(item.unit_price_cents / 100).toFixed(2)}</td>
                  <td className="text-right py-2 font-medium">
                    ${((item.quantity * item.unit_price_cents) / 100).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-right font-semibold mt-2">Total: ${((invoice.total_cents ?? 0) / 100).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
