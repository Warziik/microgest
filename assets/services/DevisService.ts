import {CUSTOMERS_URI, DEVIS_URI, LAST_ADDED_DEVIS} from "../config/entrypoints";
import {Collection} from "../types/Collection";
import {Devis, DevisFormData, DevisUpdateFormData} from "../types/Devis";
import {ErrorResponse} from "../types/ErrorResponse";
import {DataAccess} from "../utils/dataAccess";

/**
 * Retrieves all the Devis who belongs to all the Customers linked to the User.
 */
export function fetchAllDevis(): Promise<[boolean, Collection<Devis> | ErrorResponse]> {
    return DataAccess.request(DEVIS_URI, {
        method: "GET",
    });
}

export function fetchAllDevisOfCustomer(
    customerId: number
): Promise<[boolean, Collection<Devis> | ErrorResponse]> {
    return DataAccess.request(`${CUSTOMERS_URI}/${customerId}/devis`, {
        method: "GET",
    });
}

export function fetchDevis(id: number): Promise<[boolean, Devis]> {
    return DataAccess.request(`${DEVIS_URI}/${id}`, {
        method: "GET",
    });
}

export function fetchLastAddedDevis(): Promise<[boolean, Collection<Devis> | ErrorResponse]> {
    return DataAccess.request(LAST_ADDED_DEVIS, {method: "GET"});
}

/**
 * Send a POST request to create a new Devis.
 *
 * @param customerId The Customer's id
 * @param data DevisFormData
 */
export function createDevis(
    customerId: number,
    data: DevisFormData
): Promise<[boolean, Devis | ErrorResponse]> {
    return DataAccess.request(DEVIS_URI, {
        method: "POST",
        body: JSON.stringify({
            ...data,
            customer: `/api/customers/${customerId}`,
        }),
    });
}

/**
 * Send a PUT request to update an existing Devis.
 *
 * @param id The Devis's id
 */
export function updateDevis(
    id: number,
    data: DevisUpdateFormData
): Promise<[boolean, Devis | ErrorResponse]> {
    return DataAccess.request(`${DEVIS_URI}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

/**
 * Send a DELETE request to delete the Devis.
 *
 * @param id The Devis's id
 */
export function deleteDevis(id: number): Promise<[boolean, []]> {
    return DataAccess.request(`${DEVIS_URI}/${id}`, {
        method: "DELETE",
    });
}
