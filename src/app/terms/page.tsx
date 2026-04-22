import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms — freelanceflow',
};

export default function TermsPage() {
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

      <h1 className="text-3xl font-semibold mb-6">Terms</h1>
      <p className="text-sm text-neutral-500 mb-8">Placeholder — full terms in progress.</p>

      <div className="text-neutral-700 space-y-4 leading-relaxed">
        <p>Plain-English short version:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Use the service for legitimate freelance work. Don&apos;t abuse it.</li>
          <li>You own the content you create (proposals, contracts, client data).</li>
          <li>Accounts can be suspended for abuse, fraud, or violations.</li>
          <li>The service is provided as-is. We&apos;ll do our best to keep it running but can&apos;t guarantee uninterrupted availability.</li>
          <li>We can update these terms; we&apos;ll notify you of material changes.</li>
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
