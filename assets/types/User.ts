import { Customer } from "./Customer";

export interface User {
    "@context"?: string;
    "@id"?: string;
    "@type"?: string;
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    roles?: Array<string>;
    password?: string;
    createdAt?: string;
    updatedAt?: string;
    customers?: Customer[];
    confirmationToken?: string;
    confirmedAt?: string;
}

export interface SignupData {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}