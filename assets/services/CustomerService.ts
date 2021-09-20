import {CUSTOMERS_URI} from "../config/entrypoints";
import {Collection} from "../types/Collection";
import {CustomerFormData, Customer} from "../types/Customer";
import {ErrorResponse} from "../types/ErrorResponse";
import {DataAccess} from "../utils/dataAccess";
import {Cache} from "../utils/cache";

/**
 * Send a GET request to retrieve all the Customers who belongs to the logged User.
 */
export async function fetchAllCustomers(): Promise<[boolean, Collection<Customer>]> {
    const cachedCustomers = await Cache.get("customers");
    if (cachedCustomers) return [true, cachedCustomers as Collection<Customer>];

    const [isSuccess, responseData] = await DataAccess.request(CUSTOMERS_URI, {
        method: "GET",
    });

    if (isSuccess) Cache.set("customers", responseData);

    return [isSuccess, responseData];
}

export async function fetchCustomer(id: number): Promise<[boolean, Customer]> {
    const cachedCustomer = await Cache.get(`customer.${id}`);
    if (cachedCustomer) return [true, cachedCustomer as Customer];

    const [isSuccess, responseData] = await DataAccess.request(`${CUSTOMERS_URI}/${id}`, {
        method: "GET",
    });

    if (isSuccess) Cache.set(`customer.${id}`, responseData);

    return [isSuccess, responseData];
}

/**
 * Send a POST request to create a new Customer for the logged User.
 *
 * @param data The Customer data
 */
export async function createCustomer(
    data: CustomerFormData
): Promise<[boolean, Customer | ErrorResponse]> {
    const [isSuccess, responseData] = await DataAccess.request(CUSTOMERS_URI, {
        method: "POST",
        body: JSON.stringify(data),
    });

    if (isSuccess) {
        const cachedCustomers = await Cache.get("customers");
        if (cachedCustomers) {
            cachedCustomers["hydra:member"] = [...cachedCustomers["hydra:member"], responseData];
        }
    }

    return [isSuccess, responseData];
}

/**
 * Send a PUT request to update an existing Customer.
 *
 * @param id The Customer's id
 * @param data The data to update
 */
export async function updateCustomer(
    id: number,
    data: CustomerFormData
): Promise<[boolean, Customer | ErrorResponse]> {
    const [isSuccess, responseData] = await DataAccess.request(`${CUSTOMERS_URI}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });

    const cachedCustomers = await Cache.get("customers");
    const cachedCustomer = await Cache.get(`customer.${id}`);

    if (isSuccess) {
        if (cachedCustomers) {
            const index = cachedCustomers["hydra:member"].findIndex((customer: Customer) => customer.id === id);
            cachedCustomers["hydra:member"][index] = responseData;
        }
        if (cachedCustomer) Cache.set(`customer.${id}`, responseData);
    }

    return [isSuccess, responseData];
}

/**
 * Send a POST request to update a Customer's picture.
 *
 * @param id The Customer's id
 * @param data The data to update
 */
export async function updateCustomerPicture(
    id: number,
    data: FormData
): Promise<[boolean, any | ErrorResponse]> {
    return DataAccess.request(
        `${CUSTOMERS_URI}/${id}/picture`,
        {
            method: "POST",
            body: data,
        },
        false
    );
}

/**
 * Send a DELETE request to delete the Customer and its related Invoices.
 *
 * @param id The Customer's id
 */
export async function deleteCustomer(id: number): Promise<[boolean, []]> {
    const [isSuccess, data] = await DataAccess.request(`${CUSTOMERS_URI}/${id}`, {
        method: "DELETE",
    });

    if (isSuccess) {
        const cachedCustomers = await Cache.get("customers");
        const cachedCustomer = await Cache.get(`customer.${id}`);

        if (cachedCustomers) {
            cachedCustomers["hydra:member"] = cachedCustomers["hydra:member"].filter((customer: Customer) => customer.id !== id);
        }
        if (cachedCustomer) Cache.invalidate(`customer.${id}`);
    }

    return [isSuccess, data];
}
