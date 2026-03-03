'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ClientOption {
  id: string;
  name: string;
  email: string;
}

interface ContractOption {
  id: string;
  title: string;
  client_id: string;
  proposal?: {
    id: string;
    total_cents: number;
    items?: Array<{ description: string; quantity: number; unit_price_cents: number }>;
  };
}

export default function InvoiceForm({
  clients,
  contracts,
}: {
  clients: ClientOption[];
  contracts: ContractOption[];
}) {
  const router = useRouter();
  const [clientId, setClientId] = useState('');
  const [contractId, setContractId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<Array<{ description: string; quantity: number; unit_price_cents: number }>>([
    { description: '', quantity: 1, unit_price_cents: 0 },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedContract = contracts.find((c) => c.id === contractId);

  useEffect(() => {
    if (selectedContract?.proposal?.items?.length) {
      setItems(
        selectedContract.proposal.items.map((i) => ({
          description: i.description,
          quantity: i.quantity,
          unit_price_cents: i.unit_price_cents,
        }))
      );
    }
    if (selectedContract?.client_id) {
      setClientId(selectedContract.client_id);
    }
  }, [contractId, selectedContract?.client_id, selectedContract?.proposal?.items]);

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
    const proposalId = selectedContract?.proposal?.id ?? null;
    const res = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        contract_id: contractId || null,
        proposal_id: proposalId,
        due_date: dueDate || null,
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
    router.push(`/invoices/${data.id}`);
    router.refresh();
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
        <label htmlFor="contract" className="block text-sm font-medium text-neutral-700 mb-1">
          From signed contract (optional)
        </label>
        <select
          id="contract"
          value={contractId}
          onChange={(e) => setContractId(e.target.value)}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
        >
          <option value="">None / manual</option>
          {contracts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="due_date" className="block text-sm font-medium text-neutral-700 mb-1">
          Due date (optional)
        </label>
        <input
          id="due_date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-neutral-700">Line items</label>
          <button type="button" onClick={addLine} className="text-sm text-neutral-600 hover:underline">
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
                placeholder="Cents"
                value={item.unit_price_cents || ''}
                onChange={(e) => updateLine(i, 'unit_price_cents', Number(e.target.value) || 0)}
                className="w-24 px-3 py-2 border border-neutral-300 rounded-lg"
              />
              <button type="button" onClick={() => removeLine(i)} className="text-neutral-500 hover:text-red-600 p-2">
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
        {loading ? 'Creating...' : 'Create invoice'}
      </button>
    </form>
  );
}
