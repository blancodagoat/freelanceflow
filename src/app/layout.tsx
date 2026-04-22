import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "freelanceflow — proposal, contract, invoice in one link",
  description: "Proposals, e-signed contracts, and invoicing in a single flow. Built for solo freelancers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-neutral-50 text-neutral-900">
        {children}
      </body>
    </html>
  );
}
