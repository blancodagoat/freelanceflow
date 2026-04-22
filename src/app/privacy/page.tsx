import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy — freelanceflow',
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <nav className="mb-12">
        <Link
          href="/"
          className="text-sm text-neutral-600 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 rounded-sm"
        >
          ← freelanceflow
        </Link>
      </nav>

      <h1 className="text-3xl font-semibold mb-6">Privacy</h1>
      <p className="text-sm text-neutral-500 mb-8">Placeholder — full policy in progress.</p>

      <div className="text-neutral-700 space-y-4 leading-relaxed">
        <p>Short version while we draft the long one:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>We collect what we need to run the service — email, account data, proposals, contracts, and invoice records you create.</li>
          <li>We don&apos;t sell your data.</li>
          <li>Your data lives in Supabase (Postgres) and Stripe (if you connect it for payments).</li>
          <li>You can delete your account and your data at any time.</li>
        </ul>
        <p>
          Questions? Email{' '}
          <a href="mailto:hello@freelanceflow.example" className="underline hover:text-neutral-900">
            hello@freelanceflow.example
          </a>
          .
        </p>
      </div>
    </main>
  );
}
