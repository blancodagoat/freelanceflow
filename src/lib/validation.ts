import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email('Valid email is required'),
  company: z.string().max(200).optional().nullable(),
});

export const proposalSchema = z.object({
  client_id: z.string().uuid('Valid client ID is required'),
  title: z.string().min(1, 'Title is required').max(200),
  valid_until: z.string().date().optional().nullable(),
  items: z.array(z.object({
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().int().positive().default(1),
    unit_price_cents: z.number().int().min(0).default(0),
  })).default([]),
});

export const proposalUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  status: z.enum(['draft', 'sent', 'accepted', 'declined']).optional(),
  valid_until: z.string().date().optional().nullable(),
  items: z.array(z.object({
    description: z.string().min(1),
    quantity: z.number().int().positive().default(1),
    unit_price_cents: z.number().int().min(0).default(0),
  })).optional(),
});

export const contractSchema = z.object({
  proposal_id: z.string().uuid('Valid proposal ID is required'),
  client_id: z.string().uuid().optional(),
  title: z.string().min(1, 'Title is required').max(200),
});

export const contractUpdateSchema = z.object({
  status: z.enum(['draft', 'pending_signature', 'signed']).optional(),
  signed_pdf_url: z.string().url().optional().nullable(),
  signed_at: z.string().datetime().optional().nullable(),
  external_signature_id: z.string().optional().nullable(),
});

export const invoiceUpdateSchema = z.object({
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'void']).optional(),
  stripe_payment_link_url: z.string().url().optional().nullable(),
  stripe_payment_link_id: z.string().optional().nullable(),
  paid_at: z.string().datetime().optional().nullable(),
});

export const invoiceSchema = z.object({
  client_id: z.string().uuid('Valid client ID is required'),
  proposal_id: z.string().uuid().optional().nullable(),
  contract_id: z.string().uuid().optional().nullable(),
  due_date: z.string().date().optional().nullable(),
  items: z.array(z.object({
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().int().positive().default(1),
    unit_price_cents: z.number().int().min(0).default(0),
  })).default([]),
});
