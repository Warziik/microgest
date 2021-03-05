import { USERS_URI } from "../config/config";
import { User } from "../types/User";

const headers: Headers = new Headers({"Content-Type": "application/json", "Accept": "application/ld+json"});

async function fetchRequest(uri: string, bodyParams: Object, method: string = "POST"): Promise<Array<any>> {
    const request: Request = new Request(uri, {
        method: method,
        body: JSON.stringify(bodyParams),
        headers
    });

    const response: any = await fetch(request)
        .then(response => response)
        .catch(err => console.error);

    const responseData = await response.json();

    return [response.ok, responseData];
}

/**
 * Send a POST request to create a new User with the data provided in the registration form.
 * 
 * @param data The data provided by the User in the registration form
 */
async function register(data: User): Promise<Array<any>> {
    return fetchRequest(USERS_URI, data);
}

export {register};