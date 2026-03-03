export type ProposalStatus = 'draft' | 'sent' | 'accepted' | 'declined';
export type ContractStatus = 'draft' | 'pending_signature' | 'signed';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export interface Client {
  id: string;
  user_id: string;
  name: string;
  email: string;
  company: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProposalItem {
  id?: string;
  proposal_id?: string;
  description: string;
  quantity: number;
  unit_price_cents: number;
  sort_order: number;
}

export interface Proposal {
  id: string;
  user_id: string;
  client_id: string;
  title: string;
  status: ProposalStatus;
  total_cents: number;
  valid_until: string | null;
  public_slug: string | null;
  created_at: string;
  updated_at: string;
  client?: Client;
  items?: ProposalItem[];
}

export interface Contract {
  id: string;
  user_id: string;
  proposal_id: string;
  client_id: string;
  title: string;
  status: ContractStatus;
  signed_pdf_url: string | null;
  signed_at: string | null;
  external_signature_id: string | null;
  created_at: string;
  updated_at: string;
  proposal?: Proposal;
  client?: Client;
}

export interface InvoiceItem {
  id?: string;
  invoice_id?: string;
  description: string;
  quantity: number;
  unit_price_cents: number;
  sort_order: number;
}

export interface Invoice {
  id: string;
  user_id: string;
  client_id: string;
  proposal_id: string | null;
  contract_id: string | null;
  invoice_number: string;
  total_cents: number;
  status: InvoiceStatus;
  due_date: string | null;
  stripe_payment_link_id: string | null;
  stripe_payment_link_url: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  client?: Client;
  items?: InvoiceItem[];
}
