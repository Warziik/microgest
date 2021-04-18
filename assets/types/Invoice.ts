import { Customer } from "./Customer";

export interface Invoice {
    "@id": string;
    "@type": string;
    id: number;
    amount: number;
    chrono: string;
    customer: Customer;
    paidAt: string;
    sentAt: string;
    status: "NEW" | "SENT" | "PAID" | "CANCELLED";
    service: string;
}