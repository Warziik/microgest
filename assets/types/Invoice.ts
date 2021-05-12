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
    status?: string;
    sentAt?: string;
    paidAt?: string;
    tvaApplicable: boolean;
    serviceDoneAt: string;
    paymentDeadline: string;
    paymentDelayRate: number;
    services: InvoiceService[];
}

export interface InvoiceServiceFormData {
    name: string;
    description: string | null;
    quantity: number;
    unitPrice: number;
}