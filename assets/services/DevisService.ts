import {CUSTOMERS_URI, DEVIS_URI, LAST_ADDED_DEVIS_URI} from "../config/entrypoints";
import {Collection} from "../types/Collection";
import {Devis, DevisFormData, DevisUpdateFormData} from "../types/Devis";
import {ErrorResponse} from "../types/ErrorResponse";
import {DataAccess} from "../utils/dataAccess";
import {Cache} from "../utils/cache";

/**
 * Retrieves all the Devis who belongs to all the Customers linked to the User.
 */
export async function fetchAllDevis(): Promise<[boolean, Collection<Devis> | ErrorResponse]> {
    const cachedDevis = await Cache.get("devis");
    if (cachedDevis) return [true, cachedDevis as Collection<Devis>];

    const [isSuccess, responseData] = await DataAccess.request(DEVIS_URI, {
        method: "GET",
    });

    if (isSuccess) Cache.set("devis", responseData);

    return [isSuccess, responseData];
}

export async function fetchAllDevisOfCustomer(
    customerId: number
): Promise<[boolean, Collection<Devis> | ErrorResponse]> {
    const cachedDevisOfCustomer = await Cache.get(`customer.${customerId}.devis`);
    if (cachedDevisOfCustomer) return [true, cachedDevisOfCustomer as Collection<Devis>];

    const [isSuccess, responseData] = await DataAccess.request(`${CUSTOMERS_URI}/${customerId}/devis`, {
        method: "GET",
    });

    if (isSuccess) Cache.set(`customer.${customerId}.devis`, responseData);

    return [isSuccess, responseData];
}

export async function fetchDevis(id: number): Promise<[boolean, Devis]> {
    const cachedSingleDevis = await Cache.get(`devis_details.${id}`);
    if (cachedSingleDevis) return [true, cachedSingleDevis as Devis];

    const [isSuccess, responseData] = await DataAccess.request(`${DEVIS_URI}/${id}`, {
        method: "GET",
    });

    if (isSuccess) Cache.set(`devis_details.${id}`, responseData);

    return [isSuccess, responseData];
}

export function fetchLastAddedDevis(): Promise<[boolean, Collection<Devis> | ErrorResponse]> {
    return DataAccess.request(LAST_ADDED_DEVIS_URI, {method: "GET"});
}

/**
 * Send a POST request to create a new Devis.
 *
 * @param customerId The Customer's id
 * @param data DevisFormData
 */
export async function createDevis(
    customerId: number,
    data: DevisFormData
): Promise<[boolean, Devis | ErrorResponse]> {
    const [isSuccess, responseData] = await DataAccess.request(DEVIS_URI, {
        method: "POST",
        body: JSON.stringify({
            ...data,
            customer: `/api/customers/${customerId}`,
        }),
    });

    if (isSuccess) {
        const cachedDevis = await Cache.get("devis");
        if (cachedDevis) {
            cachedDevis["hydra:member"] = [...cachedDevis["hydra:member"], responseData];
        }
    }

    return [isSuccess, responseData];
}

/**
 * Send a PUT request to update an existing Devis.
 *
 * @param id The Devis's id
 * @param data Form data
 */
export async function updateDevis(
    id: number,
    data: DevisUpdateFormData
): Promise<[boolean, Devis | ErrorResponse]> {
    const [isSuccess, responseData] = await DataAccess.request(`${DEVIS_URI}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });

    const cachedDevis = await Cache.get("devis");
    const cachedSingleDevis = await Cache.get(`devis_details.${id}`);

    if (isSuccess) {
        if (cachedDevis) {
            const index = cachedDevis["hydra:member"].findIndex((devis: Devis) => devis.id === id);
            cachedDevis["hydra:member"][index] = responseData;
        }
        if (cachedSingleDevis) Cache.set(`devis_details.${id}`, responseData);
    }

    return [isSuccess, responseData];
}

/**
 * Send a DELETE request to delete the Devis.
 *
 * @param id The Devis's id
 */
export async function deleteDevis(id: number): Promise<[boolean, []]> {
    const [isSuccess, data] = await DataAccess.request(`${DEVIS_URI}/${id}`, {
        method: "DELETE",
    });

    if (isSuccess) {
        const cachedDevis = await Cache.get("devis");
        const cachedSingleDevis = await Cache.get(`devis_details.${id}`);

        if (cachedDevis) {
            cachedDevis["hydra:member"] = cachedDevis["hydra:member"].filter((devis: Devis) => devis.id !== id);
        }
        if (cachedSingleDevis) Cache.invalidate(`devis_details.${id}`);
    }

    return [isSuccess, data];
}
