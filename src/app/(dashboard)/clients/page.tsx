import { Suspense } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ClientsTableSkeleton } from '@/components/Skeleton';

async function ClientsList() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', user.id)
    .order('name');

  if (!clients?.length) {
    return (
      <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center">
        <p className="text-neutral-500 text-sm mb-4">No clients yet.</p>
        <Link href="/clients/new" className="text-neutral-900 hover:underline text-sm">
          Add your first client
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            <th className="text-left text-sm font-medium text-neutral-600 px-4 py-3">Name</th>
            <th className="text-left text-sm font-medium text-neutral-600 px-4 py-3">Email</th>
            <th className="text-left text-sm font-medium text-neutral-600 px-4 py-3">Company</th>
            <th className="w-20" />
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c.id} className="border-b border-neutral-100 last:border-0">
              <td className="px-4 py-3">
                <Link href={`/clients/${c.id}`} className="font-medium text-neutral-900 hover:underline">
                  {c.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-neutral-600">{c.email}</td>
              <td className="px-4 py-3 text-neutral-600">{c.company ?? '—'}</td>
              <td className="px-4 py-3">
                <Link href={`/clients/${c.id}`} className="text-sm text-neutral-600 hover:underline">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ClientsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Clients</h1>
        <Link href="/clients/new" className="px-4 py-2 bg-neutral-900 text-white text-sm rounded-lg hover:bg-neutral-800">
          Add client
        </Link>
      </div>
      <Suspense fallback={<ClientsTableSkeleton />}>
        <ClientsList />
      </Suspense>
    </div>
  );
}
