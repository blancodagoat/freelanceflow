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
  const [loading, setLoading] = useState(false);

  async function createOrOpenPaymentLink() {
    if (invoice.stripe_payment_link_url) {
      window.open(invoice.stripe_payment_link_url, '_blank');
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/invoices/${invoice.id}/payment-link`, { method: 'POST' });
    const data = await res.json();
    setLoading(false);
    if (data.url) window.open(data.url, '_blank');
    if (res.ok) router.refresh();
  }

  async function markSent() {
    const res = await fetch(`/api/invoices/${invoice.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'sent' }),
    });
    if (res.ok) router.refresh();
  }

  async function markPaid() {
    const res = await fetch(`/api/invoices/${invoice.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'paid', paid_at: new Date().toISOString() }),
    });
    if (res.ok) router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      {invoice.status === 'draft' && (
        <button
          type="button"
          onClick={markSent}
          className="px-4 py-2 border border-neutral-300 text-sm rounded-lg hover:bg-neutral-50"
        >
          Mark as sent
        </button>
      )}
      {(invoice.status === 'draft' || invoice.status === 'sent') && (
        <button
          type="button"
          onClick={createOrOpenPaymentLink}
          disabled={loading}
          className="px-4 py-2 bg-neutral-900 text-white text-sm rounded-lg hover:bg-neutral-800 disabled:opacity-50"
        >
          {loading ? 'Creating...' : invoice.stripe_payment_link_url ? 'Open payment link' : 'Create payment link'}
        </button>
      )}
      {(invoice.status === 'draft' || invoice.status === 'sent') && (
        <button
          type="button"
          onClick={markPaid}
          className="px-4 py-2 border border-green-600 text-green-700 text-sm rounded-lg hover:bg-green-50"
        >
          Mark as paid
        </button>
      )}
    </div>
  );
}
