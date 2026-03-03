'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Invoice {
  id: string;
  status: string;
  stripe_payment_link_url: string | null;
}

export default function InvoiceActions({ invoice }: { invoice: Invoice }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function createOrOpenPaymentLink() {
    if (invoice.stripe_payment_link_url) {
      window.open(invoice.stripe_payment_link_url, '_blank');
      return;
    }
    setLoading('payment');
    setError(null);
    try {
      const res = await fetch(`/api/invoices/${invoice.id}/payment-link`, { method: 'POST' });
      const data = await res.json();
      if (data.url) window.open(data.url, '_blank');
      else setError('Failed to create payment link');
      if (res.ok) router.refresh();
    } catch {
      setError('Failed to create payment link');
    }
    setLoading(null);
  }

  async function markSent() {
    setLoading('sent');
    setError(null);
    const res = await fetch(`/api/invoices/${invoice.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'sent' }),
    });
    setLoading(null);
    if (res.ok) router.refresh();
    else setError('Failed to mark as sent');
  }

  async function markPaid() {
    setLoading('paid');
    setError(null);
    const res = await fetch(`/api/invoices/${invoice.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'paid', paid_at: new Date().toISOString() }),
    });
    setLoading(null);
    if (res.ok) router.refresh();
    else setError('Failed to mark as paid');
  }

  return (
    <div className="flex flex-col gap-2">
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="flex flex-wrap gap-2">
        {invoice.status === 'draft' && (
          <button
            type="button"
            onClick={markSent}
            disabled={!!loading}
            className="px-4 py-2 border border-neutral-300 text-sm rounded-lg hover:bg-neutral-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            {loading === 'sent' ? 'Updating...' : 'Mark as sent'}
          </button>
        )}
        {(invoice.status === 'draft' || invoice.status === 'sent') && (
          <button
            type="button"
            onClick={createOrOpenPaymentLink}
            disabled={!!loading}
            className="px-4 py-2 bg-neutral-900 text-white text-sm rounded-lg hover:bg-neutral-800 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            {loading === 'payment' ? 'Creating...' : invoice.stripe_payment_link_url ? 'Open payment link' : 'Create payment link'}
          </button>
        )}
        {(invoice.status === 'draft' || invoice.status === 'sent') && (
          <button
            type="button"
            onClick={markPaid}
            disabled={!!loading}
            className="px-4 py-2 border border-green-600 text-green-700 text-sm rounded-lg hover:bg-green-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            {loading === 'paid' ? 'Updating...' : 'Mark as paid'}
          </button>
        )}
      </div>
    </div>
  );
}
