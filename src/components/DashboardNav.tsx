'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function DashboardNav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);

  const nav = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/clients', label: 'Clients' },
    { href: '/proposals', label: 'Proposals' },
    { href: '/contracts', label: 'Contracts' },
    { href: '/invoices', label: 'Invoices' },
  ];

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  function isActive(href: string) {
    return pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
  }

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-400 rounded">
            Unified Freelancer Stack
          </Link>
          <nav className="hidden md:flex gap-6">
            {nav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm rounded focus:outline-none focus:ring-2 focus:ring-neutral-400 ${
                  isActive(href) ? 'text-neutral-900 font-medium' : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <span className="text-sm text-neutral-500">{userEmail}</span>
          <button
            onClick={handleSignOut}
            className="text-sm text-neutral-600 hover:text-neutral-900 rounded focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            Sign out
          </button>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-1.5 rounded-lg text-neutral-600 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          aria-label="Toggle navigation"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-neutral-200 px-6 py-3 flex flex-col gap-1">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 ${
                isActive(href) ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="flex items-center justify-between px-3 py-2 mt-1 border-t border-neutral-100">
            <span className="text-sm text-neutral-500">{userEmail}</span>
            <button
              onClick={handleSignOut}
              className="text-sm text-neutral-600 hover:text-neutral-900 rounded focus:outline-none focus:ring-2 focus:ring-neutral-400"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
