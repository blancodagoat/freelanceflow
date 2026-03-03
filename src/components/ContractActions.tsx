'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Contract {
  id: string;
  status: string;
}

export default function ContractActions({ contract }: { contract: Contract }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function requestSignature() {
    setLoading('signature');
    setError(null);
    const res = await fetch(`/api/contracts/${contract.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'pending_signature' }),
    });
    setLoading(null);
    if (res.ok) router.refresh();
    else setError('Failed to request signature');
  }

  async function markSigned() {
    setLoading('signed');
    setError(null);
    const res = await fetch(`/api/contracts/${contract.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'signed', signed_at: new Date().toISOString() }),
    });
    setLoading(null);
    if (res.ok) router.refresh();
    else setError('Failed to mark as signed');
  }

  return (
    <div className="flex flex-col gap-2">
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="flex gap-2">
        {contract.status === 'draft' && (
          <button
            type="button"
            onClick={requestSignature}
            disabled={!!loading}
            className="px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
          >
            {loading === 'signature' ? 'Requesting...' : 'Request signature'}
          </button>
        )}
        {(contract.status === 'draft' || contract.status === 'pending_signature') && (
          <button
            type="button"
            onClick={markSigned}
            disabled={!!loading}
            className="px-4 py-2 border border-neutral-300 text-sm rounded-lg hover:bg-neutral-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            {loading === 'signed' ? 'Updating...' : 'Mark as signed'}
          </button>
        )}
      </div>
    </div>
  );
}
