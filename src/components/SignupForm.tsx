'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const inputClass =
  'w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-900 focus:ring-offset-0 focus:outline-none focus:border-neutral-900';

const primaryButton =
  'w-full py-2.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

const secondaryButton =
  'w-full py-2.5 border border-neutral-300 rounded-lg bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 flex items-center justify-center gap-2 text-sm font-medium';

function GoogleMark() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 48 48"
      className="h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  );
}

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSent(true);
  }

  async function handleGoogleSignIn() {
    setError(null);
    const { error: err } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (err) setError(err.message);
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-50">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">Check your email.</h1>
          <p className="text-neutral-600 text-sm mb-6">
            We sent a confirmation link to {email}. Click it to activate your account.
          </p>
          <Link
            href="/login"
            className="text-neutral-900 underline focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 rounded-sm"
          >
            Back to log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-50">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900">
            Start closing faster.
          </h1>
          <p className="mt-1.5 text-neutral-600 text-sm">
            Free while you evaluate — connect Stripe later.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className={inputClass}
            />
          </div>
          {error && (
            <p className="text-sm text-red-600" role="alert">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className={primaryButton}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className={secondaryButton}
          >
            <GoogleMark />
            <span>Continue with Google</span>
          </button>
        </div>
        <p className="mt-6 text-sm text-neutral-500 text-center">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-neutral-900 underline focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 rounded-sm"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
