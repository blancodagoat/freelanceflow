'use client';

import { useRouter } from 'next/navigation';

interface Proposal {
  id: string;
  status: string;
  public_slug: string | null;
}

export default function ProposalActions({ proposal }: { proposal: Proposal }) {
  const router = useRouter();

  async function send() {
    const res = await fetch(`/api/proposals/${proposal.id}/send`, { method: 'POST' });
    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <div className="flex gap-2">
      {proposal.status === 'draft' && (
        <button
          type="button"
          onClick={send}
          className="px-4 py-2 bg-neutral-900 text-white text-sm rounded-lg hover:bg-neutral-800"
        >
          Mark as sent
        </button>
      )}
    </div>
  );
}
