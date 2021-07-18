import { CUSTOMERS_URI, DEVIS_URI } from "../config/entrypoints";
import { Collection } from "../types/Collection";
import { Devis, DevisFormData } from "../types/Devis";
import { ErrorResponse } from "../types/ErrorResponse";
import { DataAccess } from "../utils/dataAccess";

/**
 * Retrieves all the Devis who belongs to all the Customers linked to the User.
 *
 * @param id The User's id
 */
export function fetchAllDevisOfUser(): Promise<
  [boolean, Collection<Devis> | ErrorResponse]
> {
  return DataAccess.request(DEVIS_URI, {
    method: "GET",
  });
}

export function fetchAllDevisOfCustomer(
  id: number
): Promise<[boolean, Collection<Devis> | ErrorResponse]> {
  return DataAccess.request(`${CUSTOMERS_URI}/${id}/devis`, {
    method: "GET",
  });
}

export function fetchDevis(id: number): Promise<[boolean, Devis]> {
  return DataAccess.request(`${DEVIS_URI}/${id}`, {
    method: "GET",
  });
}

/**
 * Send a POST request to create a new Devis.
 *
 * @param customerId The Customer's id
 * @param data Devis's data
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
  status: string,
  sentAt: string | null,
  signedAt: string | null
): Promise<[boolean, Devis | ErrorResponse]> {
  return DataAccess.request(`${DEVIS_URI}/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      status,
      sentAt,
      signedAt,
    }),
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
