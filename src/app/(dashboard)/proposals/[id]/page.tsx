import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ProposalActions from '@/components/ProposalActions';
import CopyableProposalLink from '@/components/CopyableProposalLink';

export default async function ProposalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: proposal } = await supabase
    .from('proposals')
    .select('*, client:clients(*), items:proposal_items(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!proposal) notFound();

  const client = proposal.client as { name: string; email: string; company?: string } | null;
  const items = (proposal.items ?? []) as Array<{ description: string; quantity: number; unit_price_cents: number }>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/proposals" className="text-sm text-neutral-600 hover:underline mb-2 inline-block">
            Back to proposals
          </Link>
          <h1 className="text-2xl font-semibold">{proposal.title}</h1>
        </div>
        <ProposalActions proposal={proposal} />
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg p-6 space-y-6">
        <div>
          <p className="text-sm text-neutral-500 mb-1">Client</p>
          <p className="font-medium">{client?.name}</p>
          <p className="text-neutral-600">{client?.email}</p>
          {client?.company && <p className="text-neutral-600">{client.company}</p>}
        </div>
        <div>
          <p className="text-sm text-neutral-500 mb-2">Status</p>
          <span className="inline-block px-2 py-1 rounded text-sm font-medium bg-neutral-100">
            {proposal.status}
          </span>
        </div>
        {proposal.public_slug && (
          <div>
            <p className="text-sm text-neutral-500 mb-1">Shareable link</p>
            <CopyableProposalLink slug={proposal.public_slug} />
            <p className="text-xs text-neutral-500 mt-1">Share this link with your client to view and accept the proposal.</p>
          </div>
        )}
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
          <p className="text-right font-semibold mt-2">Total: ${((proposal.total_cents ?? 0) / 100).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
