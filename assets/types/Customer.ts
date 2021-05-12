import { Invoice } from "./Invoice";
import { User } from "./User";

export interface Customer {
    "@context": string;
    "@id": string;
    "@type": string;
    id: number;
    type: "PERSON" | "COMPANY";
    firstname: string | null;
    lastname: string | null;
    email: string;
    phone: string | null;
    company: string | null;
    siret: string | null;
    address: string;
    city: string;
    postalCode: number;
    country: string;
    owner?: User;
    createdAt: string;
    updatedAt: string;
    invoices?: Invoice[];
    lastInvoice?: Invoice;
}

export interface CustomerFormData {
    type: "PERSON" | "COMPANY";
    firstname: string | null;
    lastname: string | null;
    email: string;
    phone: string | null;
    company: string | null;
    siret: string | null;
    address: string;
    city: string;
    postalCode: number;
    country: string;
}