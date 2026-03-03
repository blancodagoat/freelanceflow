'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ProposalItem } from '@/types';

interface ClientOption {
  id: string;
  name: string;
  email: string;
}

export default function ProposalForm({
  clients,
  proposal,
}: {
  clients: ClientOption[];
  proposal?: { id: string; client_id: string; title: string; valid_until: string | null; items?: ProposalItem[] };
}) {
  const router = useRouter();
  const [clientId, setClientId] = useState(proposal?.client_id ?? '');
  const [title, setTitle] = useState(proposal?.title ?? '');
  const [validUntil, setValidUntil] = useState(proposal?.valid_until?.slice(0, 10) ?? '');
  const [items, setItems] = useState<Array<{ description: string; quantity: number; unit_price_cents: number }>>(
    proposal?.items?.length
      ? proposal.items.map((i) => ({ description: i.description, quantity: i.quantity, unit_price_cents: i.unit_price_cents }))
      : [{ description: '', quantity: 1, unit_price_cents: 0 }]
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function addLine() {
    setItems((prev) => [...prev, { description: '', quantity: 1, unit_price_cents: 0 }]);
  }

  function removeLine(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateLine(i: number, field: string, value: string | number) {
    setItems((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  }

  const totalCents = items.reduce((sum, i) => sum + i.quantity * i.unit_price_cents, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const url = proposal ? `/api/proposals/${proposal.id}` : '/api/proposals';
      const res = await fetch(url, {
        method: proposal ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          title,
          valid_until: validUntil || null,
          items: items.filter((i) => i.description.trim()),
        }),
      });
      setLoading(false);
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? 'Something went wrong');
        return;
      }
      const data = await res.json();
      router.push(`/proposals/${data.id}`);
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label htmlFor="client" className="block text-sm font-medium text-neutral-700 mb-1">
          Client
        </label>
        <select
          id="client"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          required
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
        >
          <option value="">Select client</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.email})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
          Proposal title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
        />
      </div>
      <div>
        <label htmlFor="valid_until" className="block text-sm font-medium text-neutral-700 mb-1">
          Valid until (optional)
        </label>
        <input
          id="valid_until"
          type="date"
          value={validUntil}
          onChange={(e) => setValidUntil(e.target.value)}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-neutral-700">Line items</label>
<button 
            type="button" 
            onClick={addLine} 
            className="text-sm text-neutral-600 hover:underline"
            aria-label="Add a new line item"
          >
            Add line
          </button>
        </div>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex gap-2 items-start">
              <input
                type="text"
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateLine(i, 'description', e.target.value)}
                className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg"
              />
              <input
                type="number"
                min={0}
                step={1}
                placeholder="Qty"
                value={item.quantity || ''}
                onChange={(e) => updateLine(i, 'quantity', Number(e.target.value) || 0)}
                className="w-20 px-3 py-2 border border-neutral-300 rounded-lg"
              />
              <input
                type="number"
                min={0}
                step={0.01}
                placeholder="Unit price"
                value={(item.unit_price_cents / 100) || ''}
                onChange={(e) => updateLine(i, 'unit_price_cents', Math.round(parseFloat(e.target.value || '0') * 100))}
                className="w-28 px-3 py-2 border border-neutral-300 rounded-lg"
              />
<button 
                type="button" 
                onClick={() => removeLine(i)} 
                className="text-neutral-500 hover:text-red-600 p-2"
                aria-label={`Remove line item: ${item.description || 'item ' + (i + 1)}`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <p className="mt-2 text-sm font-medium">Total: ${(totalCents / 100).toFixed(2)}</p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:opacity-50"
      >
        {loading ? 'Saving...' : proposal ? 'Save changes' : 'Create proposal'}
      </button>
    </form>
  );
}
