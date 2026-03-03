-- Unified Freelancer Stack: Proposals, Contracts, Invoicing
-- Run this in Supabase SQL Editor to create the schema.

-- Note: gen_random_uuid() is built into PostgreSQL 13+ (used by Supabase); uuid-ossp extension not needed.

-- Profiles: one per auth user (optional; can use auth.users only)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Clients: minimal CRM
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  company text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_clients_user_id on public.clients(user_id);

-- Proposals
create type proposal_status as enum ('draft', 'sent', 'accepted', 'declined');

create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete restrict,
  title text not null,
  status proposal_status not null default 'draft',
  total_cents bigint not null default 0,
  valid_until date,
  public_slug text unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_proposals_user_id on public.proposals(user_id);
create index idx_proposals_client_id on public.proposals(client_id);
create index idx_proposals_public_slug on public.proposals(public_slug);

-- Proposal line items
create table if not exists public.proposal_items (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  description text not null,
  quantity decimal(10,2) not null default 1,
  unit_price_cents bigint not null,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

create index idx_proposal_items_proposal_id on public.proposal_items(proposal_id);

-- Contracts (from accepted proposal)
create type contract_status as enum ('draft', 'pending_signature', 'signed');

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  proposal_id uuid not null references public.proposals(id) on delete restrict,
  client_id uuid not null references public.clients(id) on delete restrict,
  title text not null,
  status contract_status not null default 'draft',
  signed_pdf_url text,
  signed_at timestamptz,
  external_signature_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_contracts_user_id on public.contracts(user_id);
create index idx_contracts_proposal_id on public.contracts(proposal_id);

-- Invoices (from contract / proposal)
create type invoice_status as enum ('draft', 'sent', 'paid', 'overdue');

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete restrict,
  proposal_id uuid references public.proposals(id) on delete set null,
  contract_id uuid references public.contracts(id) on delete set null,
  invoice_number text not null,
  total_cents bigint not null default 0,
  status invoice_status not null default 'draft',
  due_date date,
  stripe_payment_link_id text,
  stripe_payment_link_url text,
  paid_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_invoices_user_id on public.invoices(user_id);
create index idx_invoices_client_id on public.invoices(client_id);
create unique index idx_invoices_number_user on public.invoices(user_id, invoice_number);

-- Invoice line items (snapshot from proposal or custom)
create table if not exists public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  description text not null,
  quantity decimal(10,2) not null default 1,
  unit_price_cents bigint not null,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

create index idx_invoice_items_invoice_id on public.invoice_items(invoice_id);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.proposals enable row level security;
alter table public.proposal_items enable row level security;
alter table public.contracts enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;

-- Policies: user can only access own data
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);

create policy "clients_all_own" on public.clients for all using (auth.uid() = user_id);

create policy "proposals_all_own" on public.proposals for all using (auth.uid() = user_id);
create policy "proposal_items_all_via_proposal" on public.proposal_items for all
  using (exists (select 1 from public.proposals p where p.id = proposal_id and p.user_id = auth.uid()));

create policy "contracts_all_own" on public.contracts for all using (auth.uid() = user_id);

create policy "invoices_all_own" on public.invoices for all using (auth.uid() = user_id);
create policy "invoice_items_all_via_invoice" on public.invoice_items for all
  using (exists (select 1 from public.invoices i where i.id = invoice_id and i.user_id = auth.uid()));

-- Public proposal view: allow read by slug (no auth required for shareable link)
-- TO anon restricts this to unauthenticated requests only; authenticated users are covered by proposals_all_own
create policy "proposals_public_read_by_slug" on public.proposals
  for select to anon
  using (public_slug is not null);

-- Allow status update when proposal has public_slug (for client accept flow; slug acts as token)
-- TO anon restricts this to unauthenticated requests only; prevents other authenticated users from updating foreign proposals
create policy "proposals_public_accept_by_slug" on public.proposals
  for update to anon
  using (public_slug is not null)
  with check (public_slug is not null);

-- Trigger: create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
