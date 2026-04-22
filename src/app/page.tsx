import Link from 'next/link';
import {
  FileText,
  FileSignature,
  Receipt,
  ChevronRight,
  Link2,
  Timer,
  CreditCard,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      {/* Top nav */}
      <header className="border-b border-neutral-200 bg-white">
        <nav
          aria-label="Primary"
          className="mx-auto max-w-[1200px] px-6 h-16 flex items-center justify-between"
        >
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold tracking-tight focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 rounded-sm"
          >
            <span
              aria-hidden
              className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-neutral-900 text-white text-[11px] font-bold"
            >
              ff
            </span>
            <span>freelanceflow</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 rounded-md"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-medium bg-neutral-900 text-white rounded-md hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
            >
              Sign up
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-neutral-50 to-white">
          <div className="mx-auto max-w-[1100px] px-6 pt-20 pb-24 md:pt-28 md:pb-32 text-center">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-neutral-900 leading-[1.05] max-w-4xl mx-auto">
              Stop living in 4 tabs to close one client.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              freelanceflow replaces your Google Doc, DocuSign, Stripe, and spreadsheet with a
              single link. Proposal, e-signed contract, invoice — same brand, same flow.
            </p>
            <div className="mt-10 flex flex-col md:flex-row gap-4 items-center justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium bg-neutral-900 text-white rounded-md hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 w-full md:w-auto"
              >
                Start free
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-1 text-sm font-medium text-neutral-700 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 rounded-md px-2 py-1"
              >
                See how it works
                <ChevronRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        </section>

        {/* Flow motif */}
        <section id="how-it-works" className="py-20 md:py-24 border-t border-neutral-200">
          <div className="mx-auto max-w-[1100px] px-6">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                One link. Three steps. Done.
              </h2>
              <p className="mt-3 text-neutral-600 max-w-xl mx-auto">
                Every client goes through the same three screens — yours, not a vendor&apos;s.
              </p>
            </div>

            <ol className="flex flex-col md:flex-row md:items-stretch md:justify-between gap-4 md:gap-2">
              <FlowStep
                icon={<FileText className="h-7 w-7" aria-hidden />}
                step="01"
                title="Proposal"
                body="Scope, price, timeline — on your domain."
              />
              <FlowArrow />
              <FlowStep
                icon={<FileSignature className="h-7 w-7" aria-hidden />}
                step="02"
                title="Contract"
                body="They e-sign in the same flow. No redirect."
              />
              <FlowArrow />
              <FlowStep
                icon={<Receipt className="h-7 w-7" aria-hidden />}
                step="03"
                title="Invoice"
                body="Stripe checkout appears the moment they sign."
              />
            </ol>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 md:py-24 border-t border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-[1100px] px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
              <Benefit
                icon={<Link2 className="h-5 w-5" aria-hidden />}
                title="One client link."
                body="Send one URL. They see proposal, sign, and pay — no account, no downloads."
              />
              <Benefit
                icon={<Timer className="h-5 w-5" aria-hidden />}
                title="Start in seconds."
                body="Clone your last proposal, swap the scope, send. Most users draft in under 3 minutes."
              />
              <Benefit
                icon={<CreditCard className="h-5 w-5" aria-hidden />}
                title="Paid on signature."
                body="Stripe kicks in the instant the contract is signed. Deposit or full, your call."
              />
            </div>
          </div>
        </section>

        {/* CTA strip */}
        <section className="py-20 md:py-24 border-t border-neutral-200">
          <div className="mx-auto max-w-[1100px] px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Ready to close faster?
            </h2>
            <p className="mt-3 text-neutral-600">
              Free while you evaluate. Connect Stripe when you&apos;re ready to get paid.
            </p>
            <div className="mt-8">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium bg-neutral-900 text-white rounded-md hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
              >
                Start free
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="inline-flex h-5 w-5 items-center justify-center rounded bg-neutral-900 text-white text-[10px] font-bold"
            >
              ff
            </span>
            <span className="font-medium text-neutral-700">freelanceflow</span>
          </div>
          <nav aria-label="Footer" className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 rounded-sm"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 rounded-sm"
            >
              Terms
            </Link>
          </nav>
          <p>&copy; {new Date().getFullYear()} freelanceflow</p>
        </div>
      </footer>
    </div>
  );
}

function FlowStep({
  icon,
  step,
  title,
  body,
}: {
  icon: React.ReactNode;
  step: string;
  title: string;
  body: string;
}) {
  return (
    <li className="flex-1 rounded-xl bg-neutral-50 border border-neutral-200 p-6 md:p-7 flex flex-col items-start">
      <div className="flex items-center justify-between w-full mb-4">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-white border border-neutral-200 text-neutral-900">
          {icon}
        </div>
        <span className="text-xs font-semibold tracking-widest text-neutral-400">{step}</span>
      </div>
      <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
      <p className="mt-1 text-sm text-neutral-600 leading-relaxed">{body}</p>
    </li>
  );
}

function FlowArrow() {
  return (
    <div
      aria-hidden
      className="hidden md:flex items-center justify-center text-neutral-300 px-1"
    >
      <ChevronRight className="h-5 w-5" />
    </div>
  );
}

function Benefit({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div>
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-neutral-200 text-neutral-900 mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
      <p className="mt-1.5 text-sm text-neutral-600 leading-relaxed">{body}</p>
    </div>
  );
}
