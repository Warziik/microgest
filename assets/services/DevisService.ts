import { CUSTOMERS_URI, DEVIS_URI } from "../config/entrypoints";
import { Collection } from "../types/Collection";
import { Devis } from "../types/Devis";
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

export function fetchInvoice(id: number): Promise<[boolean, Devis]> {
  return DataAccess.request(`${DEVIS_URI}/${id}`, {
    method: "GET",
  });
}
