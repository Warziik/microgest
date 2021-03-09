export interface User {
    "@context"?: string;
    "@id"?: string;
    "@type"?: string;
    id?: number;
    firstname: string;
    lastname: string;
    email: string;
    roles?: Array<string>;
    password?: string;
    createdAt?: string;
    updatedAt?: string;
    customers?: Array<Record<string, unknown>>;
    confirmationToken?: string;
    confirmedAt?: string;
}