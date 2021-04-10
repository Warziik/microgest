import { User } from "./User";

export interface Customer {
    "@context": string;
    "@id": string;
    "@type": string;
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    company: string;
    owner?: User;
    createdAt: string;
    updatedAt: string;
    invoices?: Array<Record<string, any>>
    lastInvoice: { "@id": string, "@type": string, id: number, chrono: string, status: string };
}

export interface AddCustomerData {
    firstname: string;
    lastname: string;
    email: string;
    company: string;
}