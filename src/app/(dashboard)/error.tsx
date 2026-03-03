'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center">
      <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-neutral-500 mb-4">
        {error.message || 'An unexpected error occurred'}
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800"
      >
        Try again
      </button>
    </div>
  );
}
