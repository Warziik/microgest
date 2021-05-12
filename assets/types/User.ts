import { Customer } from "./Customer";

export interface User {
    "@context"?: string;
    "@id"?: string;
    "@type"?: string;
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phone?: string;
    businessName?: string;
    siret?: number;
    tvaNumber?: string;
    address?: string;
    city?: string;
    postalCode?: number;
    country?: string;
    roles?: string[];
    password?: string;
    createdAt?: string;
    updatedAt?: string;
    customers?: Customer[];
    confirmationToken?: string;
    confirmedAt?: string;
}

export interface SigninData {
    email: string;
    password: string;
}

export interface SignupData {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phone: string | null;
    businessName: string | null;
    siret: string;
    tvaNumber: string | null;
    address: string;
    city: string;
    postalCode: number;
    country: string;    
}