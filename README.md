# Unified Freelancer Stack

One platform for proposals, e-signed contracts, and invoicing. Proposal to contract to invoice in a single flow.

## Quick start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env.local
   ```

   Set at least:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Set up the database**

   In the [Supabase](https://supabase.com) SQL Editor, run the contents of `supabase/schema.sql`.

4. **Run the app**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Sign up, add a client, create a proposal, share the link, then create a contract and invoice from it.

## Documentation

Full setup, configuration, API reference, and deployment are in **[docs/DOCUMENTATION.md](docs/DOCUMENTATION.md)**.

## Stack

- Next.js 14 (App Router), TypeScript, Tailwind CSS
- Supabase (PostgreSQL, Auth)
- Stripe (payment links and webhooks; optional)

## License

Private. All rights reserved.

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Q5Q668VS3)
