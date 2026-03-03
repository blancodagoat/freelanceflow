'use client';

import { useState } from 'react';

export default function CopyableProposalLink({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? `${window.location.origin}/proposal/${slug}` : `/proposal/${slug}`;

  async function copy() {
    await navigator.clipboard.writeText(typeof window !== 'undefined' ? `${window.location.origin}/proposal/${slug}` : '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2">
      <code className="text-sm bg-neutral-100 px-2 py-1 rounded break-all flex-1">
        {url}
      </code>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 px-2 py-1 text-sm border border-neutral-300 rounded hover:bg-neutral-50"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}
