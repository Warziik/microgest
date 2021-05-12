import { CUSTOMERS_URI, INVOICES_URI } from "../config/entrypoints";
import { Collection } from "../types/Collection";
import { ErrorResponse } from "../types/ErrorResponse";
import { Invoice, InvoiceFormData } from "../types/Invoice";
import { DataAccess } from "../utils/dataAccess";

/**
 * Retrieves all the Invoices who belongs to all the Customers linked to the User. 
 * 
 * @param id The User's id
 */
export function fetchAllInvoicesOfUser(): Promise<[boolean, Collection<Invoice> | ErrorResponse]> {
    return DataAccess.request(INVOICES_URI, {
        method: "GET"
    });
}

export function fetchAllInvoicesOfCustomer(id: number): Promise<[boolean, Collection<Invoice> | ErrorResponse]> {
    return DataAccess.request(`${CUSTOMERS_URI}/${id}/invoices`, {
        method: "GET"
    });
}

export function fetchInvoice(id: number): Promise<[boolean, Invoice]> {
    return DataAccess.request(`${INVOICES_URI}/${id}`, {
        method: "GET"
    });
}

/**
 * Send a POST request to create a new Invoice. 
 * 
 * @param customerId The Customer's id
 * @param data Invoice's data
 */
export function createInvoice(customerId: number, data: InvoiceFormData): Promise<[boolean, Invoice | ErrorResponse]> {
    return DataAccess.request(INVOICES_URI, {
        method: "POST",
        body: JSON.stringify({
            ...data,
            customer: `/api/customers/${customerId}`
        })
    });
}

/**
 * Send a PUT request to update an existing Invoice. 
 * 
 * @param id The Invoice's id
 * @param data The Invoice data to update
 */
export function updateInvoice(id: number, data: InvoiceFormData): Promise<[boolean, Invoice | ErrorResponse]> {
    return DataAccess.request(`${INVOICES_URI}/${id}`, {
        method: "PUT",
        body: JSON.stringify({
            ...data,
            customer: `/api/customers/${data.customer}`
        })
    });
}

/**
 * Send a DELETE request to delete the Invoice.
 * 
 * @param id The Invoice's id
 */
export function deleteInvoice(id: number): Promise<[boolean, []]> {
    return DataAccess.request(`${INVOICES_URI}/${id}`, {
        method: "DELETE"
    });
}