import { AUTH_URI } from "../config/config";
import fetchRequest from "../utils/FetchRequest";
import { Violation } from "../types/Violation";

/**
 * Authenticate the User with the credentials provided.
 * 
 * @param email The User's email
 * @param password The User's password
 */
async function signin(email: string, password: string): Promise<[boolean, Record<string, any | Violation>]> {
    return fetchRequest(AUTH_URI, { email, password })
}

export { signin };