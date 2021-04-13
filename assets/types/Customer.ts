import { Invoice } from "./Invoice";
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
    invoices?: Invoice[];
    lastInvoice: Invoice;
}

export interface AddCustomerData {
    firstname: string;
    lastname: string;
    email: string;
    company: string;
}