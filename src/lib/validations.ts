import { z } from "zod";

export const createClientSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  company: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "LEAD"]).default("ACTIVE"),
});

export const createProposalSchema = z.object({
  title: z.string().min(1, "Proposal title is required"),
  clientId: z.string().min(1, "Client is required"),
  amount: z.number().positive("Amount must be greater than zero"),
  scope: z.string().optional(),
});

export const createInvoiceSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  amount: z.number().positive("Amount must be greater than zero"),
  dueDate: z.string().min(1, "Due date is required"),
});

export const createLeadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
  source: z.string().default("Website"),
});