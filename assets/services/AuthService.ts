import { AUTH_REFRESH_TOKEN_URI, AUTH_REVOKE_REFRESH_TOKEN_URI, AUTH_URI } from "../config/entrypoints";
import { Violation } from "../types/Violation";
import { DataAccess } from "../utils/dataAccess";

/**
 * Authenticate the User with the credentials provided.
 * 
 * @param email The User's email
 * @param password The User's password
 */
export function authenticate(email: string, password: string): Promise<[boolean, Record<string, any | Violation>]> {
    return DataAccess.request(AUTH_URI, {
        method: "POST",
        body: JSON.stringify({ email, password })
    });
}

/**
 * Send a POST request to the api endpoint to refresh the jwt token.
 * The API will get the refresh token stored in a httponly cookie and
 * returns a new JWT token.
 */
export function refreshToken() {
    return DataAccess.request(AUTH_REFRESH_TOKEN_URI, { method: "POST" });
}

/**
 * The Auth Context will call this URL 500ms before the jwt token expires to get a new one.
 */
export function revokeRefreshToken() {
    return DataAccess.request(AUTH_REVOKE_REFRESH_TOKEN_URI, { method: "POST" });
}