import {CUSTOMERS_URI, INVOICES_URI, LAST_ADDED_INVOICES_URI} from "../config/entrypoints";
import {Collection} from "../types/Collection";
import {ErrorResponse} from "../types/ErrorResponse";
import {
    Invoice,
    InvoiceFormData,
    InvoiceUpdateFormData,
} from "../types/Invoice";
import {DataAccess} from "../utils/dataAccess";
import {Cache} from "../utils/cache";

/**
 * Retrieves all the Invoices who belongs to all the Customers linked to the User.
 */
export async function fetchAllInvoices(): Promise<[boolean, Collection<Invoice>]> {
    const cachedInvoices = await Cache.get("invoices");
    if (cachedInvoices) return [true, cachedInvoices as Collection<Invoice>];

    const [isSuccess, responseData] = await DataAccess.request(INVOICES_URI, {
        method: "GET",
    });

    if (isSuccess) Cache.set("invoices", responseData);

    return [isSuccess, responseData];
}

export function fetchAllInvoicesOfCustomer(
    customerId: number
): Promise<[boolean, Collection<Invoice> | ErrorResponse]> {
    return DataAccess.request(`${CUSTOMERS_URI}/${customerId}/invoices`, {
        method: "GET",
    });
}

export async function fetchInvoice(id: number): Promise<[boolean, Invoice]> {
    const cachedInvoice = await Cache.get(`invoice.${id}`);
    if (cachedInvoice) return [true, cachedInvoice as Invoice];

    const [isSuccess, data] = await DataAccess.request(`${INVOICES_URI}/${id}`, {
        method: "GET",
    });

    if (isSuccess) Cache.set(`invoice.${id}`, data);

    return [isSuccess, data];
}

export function fetchLastAddedInvoices(): Promise<[boolean, Collection<Invoice> | ErrorResponse]> {
    return DataAccess.request(LAST_ADDED_INVOICES_URI, {method: "GET"});
}

/**
 * Send a POST request to create a new Invoice.
 *
 * @param customerId The Customer's id
 * @param data Invoice's data
 */
export async function createInvoice(
    customerId: number,
    data: InvoiceFormData
): Promise<[boolean, Invoice | ErrorResponse]> {
    const [isSuccess, responseData] = await DataAccess.request(INVOICES_URI, {
        method: "POST",
        body: JSON.stringify({
            ...data,
            customer: `/api/customers/${customerId}`,
        }),
    });

    if (isSuccess) {
        const cachedInvoices = await Cache.get("invoices");
        if (cachedInvoices) {
            cachedInvoices["hydra:member"] = [...cachedInvoices["hydra:member"], responseData];
        }
    }

    return [isSuccess, responseData];
}

/**
 * Send a PUT request to update an existing Invoice.
 *
 * @param id The Invoice's id
 * @param data Form date
 */
export async function updateInvoice(
    id: number,
    data: InvoiceUpdateFormData
): Promise<[boolean, Invoice | ErrorResponse]> {
    const [isSuccess, responseData] = await DataAccess.request(`${INVOICES_URI}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });

    const cachedInvoices = await Cache.get("invoices");
    const cachedInvoice = await Cache.get(`invoice.${id}`);

    if (isSuccess) {
        if (cachedInvoices) {
            const index = cachedInvoices["hydra:member"].findIndex((invoice: Invoice) => invoice.id === id);
            cachedInvoices["hydra:member"][index] = responseData;
        }
        if (cachedInvoice) Cache.set(`invoice.${id}`, responseData);
    }

    return [isSuccess, responseData];
}

/**
 * Send a DELETE request to delete the Invoice.
 *
 * @param id The Invoice's id
 */
export async function deleteInvoice(id: number): Promise<[boolean, []]> {
    const [isSuccess, data] = await DataAccess.request(`${INVOICES_URI}/${id}`, {
        method: "DELETE",
    });

    if (isSuccess) {
        const cachedInvoices = await Cache.get("invoices");
        const cachedInvoice = await Cache.get(`invoice.${id}`);

        if (cachedInvoices) {
            cachedInvoices["hydra:member"] = cachedInvoices["hydra:member"].filter((invoice: Invoice) => invoice.id !== id);
        }
        if (cachedInvoice) Cache.invalidate(`invoice.${id}`);
    }

    return [isSuccess, data];
}
