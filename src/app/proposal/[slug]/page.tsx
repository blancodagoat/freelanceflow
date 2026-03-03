import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AcceptProposalButton from '@/components/AcceptProposalButton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PublicProposalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createClient();
  const { data: proposal } = await supabase
    .from('proposals')
    .select('*, client:clients(name, email, company), items:proposal_items(*)')
    .eq('public_slug', slug)
    .single();

  if (!proposal) notFound();

  const client = proposal.client as { name: string; email: string; company?: string } | null;
  const items = (proposal.items ?? []) as Array<{ description: string; quantity: number; unit_price_cents: number }>;

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-6">
      <div className="max-w-2xl mx-auto bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-8 border-b border-neutral-200">
          <h1 className="text-2xl font-semibold text-neutral-900">{proposal.title}</h1>
          <p className="text-neutral-500 mt-1">Proposal from your freelancer</p>
        </div>
        <div className="p-8 space-y-6">
          <div>
            <p className="text-sm text-neutral-500 mb-1">Prepared for</p>
            <p className="font-medium">{client?.name}</p>
            <p className="text-neutral-600">{client?.email}</p>
            {client?.company && <p className="text-neutral-600">{client.company}</p>}
          </div>
          <div>
            <p className="text-sm text-neutral-500 mb-2">Scope and pricing</p>
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
            <p className="text-right font-semibold mt-2 text-lg">Total: ${((proposal.total_cents ?? 0) / 100).toFixed(2)}</p>
          </div>
          {proposal.status === 'sent' && (
            <div className="pt-4">
              <AcceptProposalButton proposalId={proposal.id} slug={slug} />
            </div>
          )}
          {proposal.status === 'accepted' && (
            <p className="text-green-700 font-medium">This proposal has been accepted.</p>
          )}
          {proposal.status === 'declined' && (
            <p className="text-neutral-500">This proposal was declined.</p>
          )}
        </div>
      </div>
    </div>
  );
}
