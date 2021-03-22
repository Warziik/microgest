import { AUTH_URI } from "../config/config";
import { Violation } from "../types/Violation";
import { DataAccess } from "../utils/dataAccess";

/**
 * Authenticate the User with the credentials provided.
 * 
 * @param email The User's email
 * @param password The User's password
 */
async function authenticate(email: string, password: string): Promise<[boolean, Record<string, any | Violation>]> {
    return await DataAccess.request(AUTH_URI, {
        method: "POST",
        body: JSON.stringify({ email, password })
    });
}

export { authenticate };