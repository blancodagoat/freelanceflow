import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ContractActions from '@/components/ContractActions';

export default async function ContractPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: contract } = await supabase
    .from('contracts')
    .select('*, proposal:proposals(*, client:clients(*), items:proposal_items(*)), client:clients(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!contract) notFound();

  const proposal = contract.proposal as {
    title: string;
    total_cents: number;
    client?: { name: string; email: string };
    items?: Array<{ description: string; quantity: number; unit_price_cents: number }>;
  } | null;
  const client = contract.client as { name: string; email: string } | null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/contracts" className="text-sm text-neutral-600 hover:underline mb-2 inline-block">
            Back to contracts
          </Link>
          <h1 className="text-2xl font-semibold">{contract.title}</h1>
        </div>
        <ContractActions contract={contract} />
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg p-6 space-y-6">
        <div>
          <p className="text-sm text-neutral-500 mb-1">Client</p>
          <p className="font-medium">{client?.name}</p>
          <p className="text-neutral-600">{client?.email}</p>
        </div>
        <div>
          <p className="text-sm text-neutral-500 mb-2">Status</p>
          <span className="inline-block px-2 py-1 rounded text-sm font-medium bg-neutral-100">
            {contract.status}
          </span>
          {contract.signed_at && (
            <p className="text-sm text-neutral-500 mt-1">Signed at {new Date(contract.signed_at).toLocaleString()}</p>
          )}
        </div>
        <div>
          <p className="text-sm text-neutral-500 mb-2">Based on proposal: {proposal?.title}</p>
          {proposal?.items?.length ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left text-sm font-medium text-neutral-600 py-2">Description</th>
                  <th className="text-right text-sm font-medium text-neutral-600 py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {proposal.items.map((item, i) => (
                  <tr key={i} className="border-b border-neutral-100">
                    <td className="py-2">{item.description}</td>
                    <td className="text-right py-2">
                      ${((item.quantity * item.unit_price_cents) / 100).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
          <p className="text-right font-semibold mt-2">Total: ${((proposal?.total_cents ?? 0) / 100).toFixed(2)}</p>
        </div>
        <p className="text-sm text-neutral-500">
          Use &ldquo;Mark as signed&rdquo; after receiving a signed copy of this contract.
        </p>
      </div>
    </div>
  );
}
