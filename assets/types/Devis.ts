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
  services: InvoiceService[];
  tvaApplicable: boolean;
}
