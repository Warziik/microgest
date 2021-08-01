import { Customer } from "./Customer";

export interface Invoice {
  "@id": string;
  "@type": string;
  id: number;
  customer: Customer;
  chrono: string;
  status: "NEW" | "SENT" | "PAID" | "CANCELLED";
  tvaApplicable: boolean;
  createdAt: string;
  serviceDoneAt: string;
  paymentDeadline: string;
  paymentDelayRate: number;
  paidAt: string;
  sentAt: string;
  totalAmount: number;
  isDraft: boolean;
  services: InvoiceService[];
}

export interface InvoiceService {
  id?: number;
  name: string;
  description: string | null;
  quantity: number;
  unitPrice: number;
  invoice?: Invoice;
}

export interface InvoiceFormData {
  customer: number;
  status: string;
  tvaApplicable: boolean;
  serviceDoneAt: string;
  paymentDeadline: string;
  paymentDelayRate: number;
  isDraft: boolean;
  services: InvoiceService[];
}

export interface InvoiceUpdateFormData {
  customer?: string; // /api/customers/1
  status?: string;
  sentAt?: string | null;
  paidAt?: string | null;
  tvaApplicable?: boolean;
  serviceDoneAt?: string;
  paymentDeadline?: string;
  paymentDelayRate?: number;
  isDraft?: boolean;
  services?: InvoiceService[];
}

export interface InvoiceServiceFormData {
  name: string;
  description: string | null;
  quantity: number;
  unitPrice: number;
}
