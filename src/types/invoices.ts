export type InvoiceStatus =
  | "DRAFT"
  | "UNPAID"
  | "OPEN"
  | "PAID"
  | "OVERDUE"
  | "VOID"
  | "UNCOLLECTIBLE";

export interface InvoiceClient {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
}

export interface InvoiceListItem {
  id: string;
  clientId: string;
  client: InvoiceClient;

  amount: number;
  amountPaid: number;
  status: InvoiceStatus | string;

  dueDate: string | null;
  createdAt: string;
  updatedAt: string;

  stripeInvoiceId: string | null;
}

export interface InvoiceMetrics {
  outstanding: number;
  paidThisMonth: number;
  overdue: number;
  drafts: number;
  totalInvoices: number;
}

export interface InvoiceListResponse {
  invoices: InvoiceListItem[];
  metrics: InvoiceMetrics;
}