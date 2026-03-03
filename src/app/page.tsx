import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-lg text-center">
        <h1 className="text-3xl font-semibold text-neutral-900 mb-2">
          Unified Freelancer Stack
        </h1>
        <p className="text-neutral-600 mb-8">
          Proposals, e-signed contracts, and invoicing in one place.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-5 py-2.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 border border-neutral-300 rounded-lg hover:bg-neutral-100"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
