import { AUTH_URI, USERS_URI } from "../config/config";
import { User } from "../types/User";
import { Violation } from "../types/Violation";

const headers: Headers = new Headers({ "Content-Type": "application/json", "Accept": "application/ld+json" });

async function fetchRequest(uri: string, bodyParams: any, method = "POST"): Promise<[boolean, Record<string, unknown>]> {
    const request: Request = new Request(uri, {
        method: method,
        body: JSON.stringify(bodyParams),
        headers
    });

    const response: any = await fetch(request)
        .then(response => response)
        .catch(err => console.error(err));

    const responseData = await response.json();

    return [response.ok, responseData];
}

/**
 * Send a POST request to create a new User with the data provided in the registration form.
 * 
 * @param data The data provided by the User in the registration form
 */
async function signup(data: User): Promise<[boolean, Record<string, any | Violation>]> {
    return fetchRequest(USERS_URI, data);
}

/**
 * Send a POST request to confirm the User account.
 * 
 * @param id The User id
 * @param token The User account confirmation token
 */
async function confirmAccount(id: number, token: string): Promise<[boolean, Record<string, unknown>]> {
    return fetchRequest(`${USERS_URI}/${id}/confirm_account`, { token });
}

/**
 * Authenticate the User with the credentials provided.
 * 
 * @param email The User's email
 * @param password The User's password
 */
async function signin(email: string, password: string): Promise<[boolean, Record<string, any | Violation>]> {
    return fetchRequest(AUTH_URI, { email, password })
}

export { signup, confirmAccount, signin };