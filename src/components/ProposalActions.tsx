'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Proposal {
  id: string;
  status: string;
  public_slug: string | null;
}

export default function ProposalActions({ proposal }: { proposal: Proposal }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/proposals/${proposal.id}/send`, { method: 'POST' });
      setLoading(false);
      if (res.ok) {
        router.refresh();
      } else {
        setError('Failed to send proposal');
      }
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="flex gap-2">
        {proposal.status === 'draft' && (
          <button
            type="button"
            onClick={send}
            disabled={loading}
            className="px-4 py-2 bg-neutral-900 text-white text-sm rounded-lg hover:bg-neutral-800 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            {loading ? 'Sending...' : 'Mark as sent'}
          </button>
        )}
      </div>
    </div>
  );
}
