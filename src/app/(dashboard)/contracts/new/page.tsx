import { createClient } from '@/lib/supabase/server';
import ContractNewForm from '@/components/ContractNewForm';
import Link from 'next/link';

export default async function NewContractPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: raw } = await supabase
    .from('proposals')
    .select('id, title, total_cents, client:clients(id, name)')
    .eq('user_id', user.id)
    .eq('status', 'accepted')
    .order('updated_at', { ascending: false });

  const proposals = (raw ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    total_cents: p.total_cents ?? 0,
    client: Array.isArray(p.client) ? p.client[0] : p.client,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">New contract</h1>
        <Link href="/contracts" className="text-sm text-neutral-600 hover:underline">
          Back to contracts
        </Link>
      </div>
      <ContractNewForm proposals={proposals} />
    </div>
  );
}
