import { INVOICES_URI } from "../config/entrypoints";
import { Collection } from "../types/Collection";
import { ErrorResponse } from "../types/ErrorResponse";
import { Invoice } from "../types/Invoice";
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

/**
 * Send a POST request to create a new Invoice. 
 * 
 * @param customerId The Customer's id
 * @param amount The amount of the Invoice
 */
export function createInvoice(customerId: number, amount: number): Promise<[boolean, Invoice | ErrorResponse]> {
    return DataAccess.request(INVOICES_URI, {
        method: "POST",
        body: JSON.stringify({
            amount: amount,
            customer: `/api/customers/${customerId}`
        })
    });
}