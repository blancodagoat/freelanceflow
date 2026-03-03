'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProposalOption {
  id: string;
  title: string;
  total_cents: number;
  client?: { id: string; name: string };
}

export default function ContractNewForm({ proposals }: { proposals: ProposalOption[] }) {
  const router = useRouter();
  const [proposalId, setProposalId] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selected = proposals.find((p) => p.id === proposalId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposal_id: proposalId, title: title || selected?.title || 'Contract' }),
      });
      setLoading(false);
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? 'Something went wrong');
        return;
      }
      const data = await res.json();
      router.push(`/contracts/${data.id}`);
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  if (!proposals.length) {
    return (
      <p className="text-neutral-500">
        No accepted proposals yet. Accept a proposal first, then create a contract from it.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <label htmlFor="proposal" className="block text-sm font-medium text-neutral-700 mb-1">
          Accepted proposal
        </label>
        <select
          id="proposal"
          value={proposalId}
          onChange={(e) => {
            setProposalId(e.target.value);
            const p = proposals.find((x) => x.id === e.target.value);
            if (p && !title) setTitle(p.title);
          }}
          required
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
        >
          <option value="">Select proposal</option>
          {proposals.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} – ${((p.total_cents ?? 0) / 100).toFixed(2)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
          Contract title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder={selected?.title}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create contract'}
      </button>
    </form>
  );
}
