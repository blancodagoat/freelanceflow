# Unified Freelancer Stack — Documentation

This document describes how to install, configure, and use the application from setup to production.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Requirements](#2-requirements)
3. [Installation](#3-installation)
4. [Configuration](#4-configuration)
5. [Database Setup](#5-database-setup)
6. [Authentication](#6-authentication)
7. [Application Structure](#7-application-structure)
8. [User Flows](#8-user-flows)
9. [API Reference](#9-api-reference)
10. [Integrations](#10-integrations)
11. [Deployment](#11-deployment)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Overview

Unified Freelancer Stack is a single application for freelancers and small service businesses that combines:

- **Proposals** — Create proposals with line items, share a link, track status (draft, sent, accepted, declined).
- **Contracts** — Create contracts from accepted proposals; track signature status; optionally integrate e-signature (e.g. Dropbox Sign, or Docuseal for self-hosted).
- **Invoicing** — Create invoices from contracts or manually; send payment links (Stripe); mark as paid.

**Core flow:** Proposal (scope and price) to Contract (template and e-sign) to Invoice (from contract, one click).

**Target users:** Solo freelancers, very small agencies (1–5 people), and small service businesses that send proposals and invoices regularly.

---

## 2. Requirements

- Node.js 18+
- npm or yarn
- A Supabase account (for database and auth)
- (Optional) Stripe account for payment links
- (Optional) Dropbox Sign account (or self-hosted Docuseal) for e-signature (not implemented in MVP; placeholder flows included)

---

## 3. Installation

### 3.1 Clone or copy the project

Ensure the project directory is available on your machine.

### 3.2 Install dependencies

From the project root:

```bash
npm install
```

### 3.3 Environment variables

Copy the example environment file and fill in values:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase and (optionally) Stripe credentials. See [Configuration](#4-configuration).

### 3.4 Run the development server

```bash
npm run dev
```

The app is available at `http://localhost:3000` (or the port shown in the terminal).

### 3.5 Build for production

```bash
npm run build
npm start
```

---

## 4. Configuration

### 4.1 Supabase (required)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (Dashboard > Settings > API). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous (public) key. Used in the browser and for RLS. |

Both are required for the app to run. Without them, auth and all data access will fail.

### 4.2 Stripe (optional)

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Secret key (e.g. `sk_test_...` for test mode). Required to create payment links. |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (e.g. `whsec_...`). Required for automatic "mark as paid" when a payment completes. |

If Stripe is not configured, payment link creation returns a 503 and users can still mark invoices as paid manually.

### 4.3 App URL (optional)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | Full public URL of the app (e.g. `https://app.example.com` or `http://localhost:3000`). Used in Stripe redirects and in documentation for shareable proposal links. |

---

## 5. Database Setup

### 5.1 Create a Supabase project

1. Go to [Supabase](https://supabase.com) and create a project.
2. Wait for the database to be ready.

### 5.2 Run the schema

1. In the Supabase Dashboard, open **SQL Editor**.
2. Open the file `supabase/schema.sql` from this project.
3. Copy its full contents and run the script in the SQL Editor.

This creates:

- Tables: `profiles`, `clients`, `proposals`, `proposal_items`, `contracts`, `invoices`, `invoice_items`
- Row Level Security (RLS) policies so each user only sees their own data
- A policy that allows public read and status-update of proposals by shareable slug (for the client accept flow)
- A trigger that creates a profile row when a new user signs up

### 5.3 Verify

After running the schema, in the Table Editor you should see the tables listed above. Do not remove RLS; the app relies on it.

---

## 6. Authentication

### 6.1 Providers

- **Email and password** — Sign up and sign in via the `/signup` and `/login` pages. Supabase sends a confirmation email for new signups (if enabled in Supabase Auth settings).
- **Google** — Optional. Configure Google OAuth in Supabase and add the redirect URL as described below.

### 6.2 Supabase Auth settings

1. In Supabase Dashboard: **Authentication > URL Configuration**.
2. Set **Site URL** to your app URL (e.g. `http://localhost:3000` or your production URL).
3. Add to **Redirect URLs**:
   - `http://localhost:3000/auth/callback` (development)
   - `https://your-production-domain.com/auth/callback` (production)

### 6.3 Google OAuth (optional)

1. In Supabase: **Authentication > Providers > Google** — enable and add Client ID and Client Secret from Google Cloud Console.
2. In Google Cloud Console, add the Supabase redirect URL (shown in Supabase) to the OAuth client’s authorized redirect URIs.

### 6.4 Session handling

The app uses `@supabase/ssr` for server-side session handling. Middleware in `src/middleware.ts` refreshes the session on each request. Protected routes (under the dashboard) redirect unauthenticated users to `/login`.

---

## 7. Application Structure

### 7.1 Directory layout

```
src/
  app/
    (dashboard)/          # Authenticated area
      dashboard/          # Dashboard home
      clients/           # Client list, new, edit
      proposals/         # Proposal list, new, view
      contracts/         # Contract list, new, view
      invoices/          # Invoice list, new, view
    proposal/[slug]/     # Public proposal view (shareable link)
    login/
    signup/
    auth/callback/       # OAuth callback
    api/
      clients/
      proposals/
      contracts/
      invoices/
      webhooks/stripe/
  components/            # Shared UI components
  lib/
    supabase/            # Supabase client (server, client, middleware)
    slug.ts              # Slug generation for shareable links
  types/                 # Shared TypeScript types
supabase/
  schema.sql             # Full database schema
docs/
  DOCUMENTATION.md       # This file
```

### 7.2 Key concepts

- **Tenancy:** All data is scoped by `user_id` (from Supabase Auth). RLS enforces that users only access their own rows.
- **Proposal slug:** Each proposal can have a unique `public_slug`. The URL `/proposal/[slug]` shows the proposal to the client (no login). The client can accept the proposal from that page; the API allows this update when the slug matches.
- **Contract from proposal:** Contracts are created only from accepted proposals. The contract stores `proposal_id` and `client_id`.
- **Invoice from contract:** Invoices can be created from a signed contract (pre-filled line items) or from scratch with a chosen client and manual line items.

---

## 8. User Flows

### 8.1 Proposal flow

1. User creates a client (name, email, optional company).
2. User creates a proposal: selects client, title, optional valid-until date, and line items (description, quantity, unit price in cents).
3. User saves the proposal (draft). A shareable link is generated (`/proposal/[slug]`).
4. User marks the proposal as "sent" and shares the link with the client.
5. Client opens the link, reviews the proposal, and clicks "Accept proposal." Status becomes "accepted."
6. User can then create a contract from that proposal.

### 8.2 Contract flow

1. User goes to Contracts > New contract.
2. User selects an accepted proposal and enters a contract title.
3. Contract is created in "draft."
4. User can "Request signature" (status: pending_signature) or "Mark as signed" (status: signed, signed_at set). E-signature integration (e.g. Dropbox Sign) can be added later to replace or complement "Mark as signed."

### 8.3 Invoice flow

1. User creates an invoice: selects client, optionally selects a signed contract to pre-fill line items, optional due date, and line items.
2. User saves the invoice (draft).
3. User can "Mark as sent," "Create payment link" (Stripe), or "Mark as paid."
4. If Stripe is configured, "Create payment link" creates a Stripe Payment Link and opens it. When the client pays, the webhook can mark the invoice as paid automatically; otherwise the user can "Mark as paid" manually.

---

## 9. API Reference

All API routes require authentication unless noted.

### 9.1 Clients

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/clients` | Create client. Body: `{ name, email, company? }`. |
| PATCH | `/api/clients/[id]` | Update client. Body: `{ name, email, company? }`. |
| DELETE | `/api/clients/[id]` | Delete client. |

### 9.2 Proposals

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/proposals` | Create proposal. Body: `{ client_id, title, valid_until?, items? }`. Items: `[{ description, quantity?, unit_price_cents? }]`. |
| GET | `/api/proposals/[id]` | Get proposal with client and items. |
| PATCH | `/api/proposals/[id]` | Update proposal. Body: `{ title?, status?, valid_until?, items? }`. |
| POST | `/api/proposals/[id]/send` | Set status to "sent." |
| POST | `/api/proposals/[id]/accept` | Set status to "accepted." Body (optional): `{ token: public_slug }` for public accept without auth. |

### 9.3 Contracts

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/contracts` | Create contract from proposal. Body: `{ proposal_id, title }`. |
| GET | `/api/contracts/[id]` | Get contract with proposal and client. |
| PATCH | `/api/contracts/[id]` | Update contract. Body: `{ status?, signed_pdf_url?, signed_at?, external_signature_id? }`. |

### 9.4 Invoices

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/invoices` | Create invoice. Body: `{ client_id, proposal_id?, contract_id?, due_date?, items? }`. |
| GET | `/api/invoices/[id]` | Get invoice with client and items. |
| PATCH | `/api/invoices/[id]` | Update invoice. Body: `{ status?, stripe_payment_link_url?, stripe_payment_link_id?, paid_at? }`. |
| POST | `/api/invoices/[id]/payment-link` | Create Stripe Payment Link and return URL; store link ID and URL on invoice. |

### 9.5 Webhooks

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/webhooks/stripe` | Stripe webhook. Handles `checkout.session.completed` and marks the corresponding invoice as paid (by session metadata or by matching `stripe_payment_link_id`). Must be configured in Stripe with this URL and the signing secret in `STRIPE_WEBHOOK_SECRET`. |

---

## 10. Integrations

### 10.1 Stripe

- **Payment Links:** Creating a payment link from an invoice uses the invoice total and stores the link URL and ID on the invoice. The customer is redirected to `NEXT_PUBLIC_APP_URL/invoices/[id]?paid=1` after payment.
- **Webhook:** Point Stripe to `https://your-domain.com/api/webhooks/stripe`, select `checkout.session.completed`, and set the signing secret in `STRIPE_WEBHOOK_SECRET`. The handler looks up the invoice by session metadata or by `stripe_payment_link_id` and sets status to "paid" and `paid_at` to now.

### 10.2 E-signature (future)

The contract flow includes "Request signature" and "Mark as signed." To integrate Dropbox Sign (or Docuseal for self-hosted/open-source):

1. Add API calls to send the contract for signature (e.g. from contract view or an API route).
2. Store the returned signature request ID in `contracts.external_signature_id`.
3. On webhook or polling, when the document is signed, update `contracts.status` to "signed," set `signed_at`, and store the signed PDF URL in `contracts.signed_pdf_url` (e.g. in Supabase Storage or your chosen file store).

---

## 11. Deployment

### 11.1 Build

```bash
npm run build
```

Fix any TypeScript or build errors before deploying.

### 11.2 Environment variables

Set all required and optional variables in your hosting platform (Vercel, Railway, etc.) as described in [Configuration](#4-configuration). Do not commit `.env.local` or production secrets.

### 11.3 Supabase

- Use the same schema in production Supabase (or a separate project) and run `supabase/schema.sql`.
- In production Supabase, set Site URL and Redirect URLs to your production domain.
- If using Google OAuth, add the production callback URL in Google Cloud Console.

### 11.4 Stripe

- Use live keys in production and create a live webhook endpoint for `checkout.session.completed` pointing to `https://your-domain.com/api/webhooks/stripe`.

### 11.5 Hosting

The app is a standard Next.js application. Deploy to Vercel, Node.js host, or any platform that supports Next.js. Ensure the Node version is 18+.

---

## 12. Troubleshooting

### 12.1 "Unauthorized" on API calls

- Confirm the user is logged in (session cookie present).
- In Supabase, ensure RLS policies are in place and the anon key is used (no service role in the client).

### 12.2 Proposal accept fails from public link

- Ensure the proposal has a `public_slug` and the URL is `/proposal/[slug]` with the correct slug.
- The accept API allows unauthenticated requests only when the body includes `token` equal to the proposal’s `public_slug`. Ensure the front end sends this.

### 12.3 Payment link not created

- Check that `STRIPE_SECRET_KEY` is set and valid.
- Check the Stripe dashboard for API errors.

### 12.4 Invoice not marked paid after Stripe payment

- Ensure the webhook is configured in Stripe with the correct URL and `STRIPE_WEBHOOK_SECRET`.
- The handler matches the invoice by `stripe_payment_link_id` from the session’s `payment_link` field. Ensure the payment was completed via the link created from this app.

### 12.5 Google sign-in redirects to wrong URL

- In Supabase Auth URL Configuration, set Site URL and add the exact redirect URL (including `/auth/callback`) to Redirect URLs.

---

End of documentation.
