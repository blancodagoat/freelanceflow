import { Suspense } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { TableSkeleton } from '@/components/Skeleton';

const statusClass: Record<string, string> = {
  draft: 'bg-neutral-100 text-neutral-700',
  sent: 'bg-amber-100 text-amber-800',
  accepted: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
};

async function ProposalsList() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: proposals } = await supabase
    .from('proposals')
    .select('*, client:clients(name, email)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (!proposals?.length) {
    return (
      <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center">
        <p className="text-neutral-500 text-sm mb-4">No proposals yet.</p>
        <Link href="/proposals/new" className="text-neutral-900 hover:underline text-sm">
          Create your first proposal
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-x-auto">
      <table className="w-full">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            <th className="text-left text-sm font-medium text-neutral-600 px-4 py-3">Title</th>
            <th className="text-left text-sm font-medium text-neutral-600 px-4 py-3">Client</th>
            <th className="text-left text-sm font-medium text-neutral-600 px-4 py-3">Status</th>
            <th className="text-right text-sm font-medium text-neutral-600 px-4 py-3">Total</th>
            <th className="w-24" />
          </tr>
        </thead>
        <tbody>
          {proposals.map((p) => (
            <tr key={p.id} className="border-b border-neutral-100 last:border-0">
              <td className="px-4 py-3">
                <Link href={`/proposals/${p.id}`} className="font-medium text-neutral-900 hover:underline">
                  {p.title}
                </Link>
              </td>
              <td className="px-4 py-3 text-neutral-600">
                {(p.client as { name?: string })?.name ?? '—'}
              </td>
              <td className="px-4 py-3">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusClass[p.status] ?? 'bg-neutral-100'}`}>
                  {p.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-medium">
                ${((p.total_cents ?? 0) / 100).toFixed(2)}
              </td>
              <td className="px-4 py-3">
                <Link href={`/proposals/${p.id}`} className="text-sm text-neutral-600 hover:underline">
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

export default function ProposalsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Proposals</h1>
        <Link href="/proposals/new" className="px-4 py-2 bg-neutral-900 text-white text-sm rounded-lg hover:bg-neutral-800">
          New proposal
        </Link>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <ProposalsList />
      </Suspense>
    </div>
  );
}
