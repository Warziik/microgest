import { Customer } from "./Customer";
import { InvoiceService } from "./Invoice";

export interface Devis {
  "@id": string;
  "@type": string;
  id: number;
  customer: Customer;
  chrono: string;
  status: "NEW" | "SENT" | "SIGNED" | "CANCELLED";
  validityDate: string;
  workStartDate: string;
  workDuration: string;
  paymentDeadline: string;
  paymentDelayRate: number;
  tvaApplicable: boolean;
  isDraft: boolean;
  sentAt: string;
  signedAt: string;
  createdAt: string;
  services: InvoiceService[];
}

export interface DevisFormData {
  customer: number;
  status: string;
  validityDate: string;
  workStartDate: string;
  workDuration: string;
  paymentDeadline: string;
  paymentDelayRate: number;
  tvaApplicable: boolean;
  isDraft: boolean;
  services: InvoiceService[];
}

export interface DevisUpdateFormData {
  customer?: string; // /api/customers/1
  status?: string;
  sentAt?: string | null;
  signedAt?: string | null;
  validityDate?: string;
  workStartDate?: string;
  workDuration?: string;
  paymentDeadline?: string;
  paymentDelayRate?: number;
  tvaApplicable?: boolean;
  isDraft?: boolean;
  services?: InvoiceService[];
}
