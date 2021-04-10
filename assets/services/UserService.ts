import { USERS_URI } from "../config/entrypoints";
import { SignupData } from "../types/User";
import { Violation } from "../types/Violation";
import { DataAccess } from "../utils/dataAccess";

/**
 * Send a POST request to create a new User with the data provided in the registration form.
 * 
 * @param data The data provided by the User in the registration form
 */
export function signup(data: SignupData): Promise<[boolean, Record<string, any | Violation>]> {
    return DataAccess.request(USERS_URI, {
        method: "POST",
        body: JSON.stringify(data)
    });
}

/**
 * Send a POST request to confirm the User account.
 * 
 * @param id The User id
 * @param token The User account confirmation token
 */
export function confirmAccount(id: number, token: string): Promise<[boolean, Record<string, unknown>]> {
    return DataAccess.request(`${USERS_URI}/${id}/confirm_account`, {
        method: "POST",
        body: JSON.stringify({ token })
    });
}

/**
 * Send an email to the specified email address (if its related to an existing User) in order to reset the User's password.
 * 
 * @param email The User's email
 */
export function forgotPassword(email: string): Promise<[boolean, Record<string, any>]> {
    return DataAccess.request(`${USERS_URI}/forgot_password`, {
        method: "POST",
        body: JSON.stringify({ email })
    });
}

/**
 * Reset the User's password.
 * 
 * @param password The new User's password
 * @param token The User's token generated when he requested to change his password.
 */
export function resetPassword(password: string, token: string): Promise<[boolean, Record<string, any>]> {
    return DataAccess.request(`${USERS_URI}/reset_password`, {
        method: "POST",
        body: JSON.stringify({ password, token })
    });
}