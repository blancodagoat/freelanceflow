import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [
    { count: clientsCount },
    { count: proposalsCount },
    { count: contractsCount },
    { count: invoicesCount },
  ] = await Promise.all([
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('proposals').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('contracts').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('invoices').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
  ]);

  const cards = [
    { label: 'Clients', count: clientsCount ?? 0, href: '/clients', cta: 'Add client' },
    { label: 'Proposals', count: proposalsCount ?? 0, href: '/proposals', cta: 'New proposal' },
    { label: 'Contracts', count: contractsCount ?? 0, href: '/contracts', cta: 'New contract' },
    { label: 'Invoices', count: invoicesCount ?? 0, href: '/invoices', cta: 'New invoice' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, count, href, cta }) => (
          <div
            key={label}
            className="bg-white border border-neutral-200 rounded-lg p-5"
          >
            <p className="text-sm text-neutral-500 mb-1">{label}</p>
            <p className="text-2xl font-semibold mb-3">{count}</p>
            <Link
              href={href}
              className="text-sm font-medium text-neutral-900 hover:underline"
            >
              {cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
