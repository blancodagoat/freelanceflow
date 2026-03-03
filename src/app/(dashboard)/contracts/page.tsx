import { Suspense } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { TableSkeleton } from '@/components/Skeleton';

const statusClass: Record<string, string> = {
  draft: 'bg-neutral-100 text-neutral-700',
  pending_signature: 'bg-amber-100 text-amber-800',
  signed: 'bg-green-100 text-green-800',
};

async function ContractsList() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: contracts } = await supabase
    .from('contracts')
    .select('*, client:clients(name), proposal:proposals(title)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (!contracts?.length) {
    return (
      <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center">
        <p className="text-neutral-500 text-sm mb-4">No contracts yet.</p>
        <Link href="/contracts/new" className="text-neutral-900 hover:underline text-sm">
          Create your first contract
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            <th className="text-left text-sm font-medium text-neutral-600 px-4 py-3">Title</th>
            <th className="text-left text-sm font-medium text-neutral-600 px-4 py-3">Client</th>
            <th className="text-left text-sm font-medium text-neutral-600 px-4 py-3">Status</th>
            <th className="w-24" />
          </tr>
        </thead>
        <tbody>
          {contracts.map((c) => (
            <tr key={c.id} className="border-b border-neutral-100 last:border-0">
              <td className="px-4 py-3">
                <Link href={`/contracts/${c.id}`} className="font-medium text-neutral-900 hover:underline">
                  {c.title}
                </Link>
              </td>
              <td className="px-4 py-3 text-neutral-600">
                {(c.client as { name?: string })?.name ?? '—'}
              </td>
              <td className="px-4 py-3">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusClass[c.status] ?? 'bg-neutral-100'}`}>
                  {c.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <Link href={`/contracts/${c.id}`} className="text-sm text-neutral-600 hover:underline">
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

export default function ContractsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Contracts</h1>
        <Link href="/contracts/new" className="px-4 py-2 bg-neutral-900 text-white text-sm rounded-lg hover:bg-neutral-800">
          New contract
        </Link>
      </div>
      <Suspense fallback={<TableSkeleton rows={3} />}>
        <ContractsList />
      </Suspense>
    </div>
  );
}
