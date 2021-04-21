import { CUSTOMERS_URI, USERS_URI } from "../config/entrypoints";
import { Collection } from "../types/Collection";
import { CustomerFormData, Customer } from "../types/Customer";
import { ErrorResponse } from "../types/ErrorResponse";
import { DataAccess } from "../utils/dataAccess";

/**
 * Send a GET request to retrieve all the Customers who belongs to the User id gave as parameter.
 * 
 * @param id The User's id
 */
export function fetchAllCustomers(id: number): Promise<[boolean, Collection<Customer>]> {
    return DataAccess.request(`${USERS_URI}/${id}/customers`, {
        method: "GET"
    });
}

export function fetchCustomer(id: number): Promise<[boolean, Customer]> {
    return DataAccess.request(`${CUSTOMERS_URI}/${id}`, {
        method: "GET"
    });
}

/**
 * Send a POST request to create a new Customer for the logged User.
 * 
 * @param data The Customer data
 */
export function createCustomer(data: CustomerFormData): Promise<[boolean, Customer | ErrorResponse]> {
    return DataAccess.request(CUSTOMERS_URI, {
        method: "POST",
        body: JSON.stringify(data)
    });
}

export function updateCustomer(id: number, data: CustomerFormData): Promise<[boolean, Customer | ErrorResponse]> {
    return DataAccess.request(`${CUSTOMERS_URI}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data)
    });
}