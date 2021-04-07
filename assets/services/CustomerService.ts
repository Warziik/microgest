import { USERS_URI } from "../config/entrypoints";
import { Collection } from "../types/Collection";
import { Customer } from "../types/Customer";
import { ErrorResponse } from "../types/ErrorResponse";
import { DataAccess } from "../utils/dataAccess";

/**
 * Send a GET request to retrieve all the Customers who belongs to the User id gave as parameter.
 * 
 * @param id The User's id
 */
function fetchAllCustomers(id: number): Promise<[boolean, Collection<Customer> | ErrorResponse]> {
    return DataAccess.request(`${USERS_URI}/${id}/customers`, {
        method: "GET"
    });
}

export { fetchAllCustomers };