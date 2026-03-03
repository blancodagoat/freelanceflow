import { Suspense } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { TableSkeleton } from '@/components/Skeleton';

const statusClass: Record<string, string> = {
  draft: 'bg-neutral-100 text-neutral-700',
  sent: 'bg-amber-100 text-amber-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
};

async function InvoicesList() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: invoices } = await supabase
    .from('invoices')
    .select('*, client:clients(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (!invoices?.length) {
    return (
      <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center">
        <p className="text-neutral-500 text-sm mb-4">No invoices yet.</p>
        <Link href="/invoices/new" className="text-neutral-900 hover:underline text-sm">
          Create your first invoice
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            <th className="text-left text-sm font-medium text-neutral-600 px-4 py-3">Number</th>
            <th className="text-left text-sm font-medium text-neutral-600 px-4 py-3">Client</th>
            <th className="text-left text-sm font-medium text-neutral-600 px-4 py-3">Status</th>
            <th className="text-right text-sm font-medium text-neutral-600 px-4 py-3">Total</th>
            <th className="w-24" />
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id} className="border-b border-neutral-100 last:border-0">
              <td className="px-4 py-3">
                <Link href={`/invoices/${inv.id}`} className="font-medium text-neutral-900 hover:underline">
                  {inv.invoice_number}
                </Link>
              </td>
              <td className="px-4 py-3 text-neutral-600">
                {(inv.client as { name?: string })?.name ?? '—'}
              </td>
              <td className="px-4 py-3">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusClass[inv.status] ?? 'bg-neutral-100'}`}>
                  {inv.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-medium">
                ${((inv.total_cents ?? 0) / 100).toFixed(2)}
              </td>
              <td className="px-4 py-3">
                <Link href={`/invoices/${inv.id}`} className="text-sm text-neutral-600 hover:underline">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function InvoicesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Invoices</h1>
        <Link href="/invoices/new" className="px-4 py-2 bg-neutral-900 text-white text-sm rounded-lg hover:bg-neutral-800">
          New invoice
        </Link>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <InvoicesList />
      </Suspense>
    </div>
  );
}
