import { createClient } from '@/lib/supabase/server';
import ProposalForm from '@/components/ProposalForm';
import Link from 'next/link';

export default async function NewProposalPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, email')
    .eq('user_id', user.id)
    .order('name');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">New proposal</h1>
        <Link href="/proposals" className="text-sm text-neutral-600 hover:underline">
          Back to proposals
        </Link>
      </div>
      <ProposalForm clients={clients ?? []} />
    </div>
  );
}
