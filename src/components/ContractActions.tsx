'use client';

import { useRouter } from 'next/navigation';

interface Contract {
  id: string;
  status: string;
}

export default function ContractActions({ contract }: { contract: Contract }) {
  const router = useRouter();

  async function requestSignature() {
    const res = await fetch(`/api/contracts/${contract.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'pending_signature' }),
    });
    if (res.ok) router.refresh();
  }

  async function markSigned() {
    const res = await fetch(`/api/contracts/${contract.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'signed', signed_at: new Date().toISOString() }),
    });
    if (res.ok) router.refresh();
  }

  return (
    <div className="flex gap-2">
      {contract.status === 'draft' && (
        <button
          type="button"
          onClick={requestSignature}
          className="px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700"
        >
          Request signature
        </button>
      )}
      {(contract.status === 'draft' || contract.status === 'pending_signature') && (
        <button
          type="button"
          onClick={markSigned}
          className="px-4 py-2 border border-neutral-300 text-sm rounded-lg hover:bg-neutral-50"
        >
          Mark as signed
        </button>
      )}
    </div>
  );
}
