import { USERS_URI } from "../config/entrypoints";
import { ErrorResponse } from "../types/ErrorResponse";
import { Invoice } from "../types/Invoice";
import { DataAccess } from "../utils/dataAccess";

/**
 * Retrieves all the Invoices who belongs to all the Customers linked to the User. 
 * 
 * @param id The User's id
 */
export function fetchAllInvoicesOfUser(id: number): Promise<[boolean, Invoice | ErrorResponse]> {
    return DataAccess.request(`${USERS_URI}/${id}/all_invoices`, {
        method: "GET"
    });
}