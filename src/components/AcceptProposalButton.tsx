'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AcceptProposalButton({ proposalId, slug }: { proposalId: string; slug: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function accept() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/proposals/${proposalId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: slug }),
      });
      setLoading(false);
      if (res.ok) {
        setDone(true);
        router.refresh();
      } else {
        setError('Failed to accept proposal');
      }
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  if (done) return <p className="text-green-700 font-medium">Accepted. Thank you.</p>;

  return (
    <>
    {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
    <button
      type="button"
      onClick={accept}
      disabled={loading}
      className="px-5 py-2.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:opacity-50"
    >
      {loading ? 'Accepting...' : 'Accept proposal'}
    </button>
    </>
  );
}
