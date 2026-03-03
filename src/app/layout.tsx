import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unified Freelancer Stack",
  description: "Proposals, contracts, and invoicing in one place.",
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
