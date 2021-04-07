import { AUTH_REFRESH_TOKEN_URI, AUTH_REVOKE_REFRESH_TOKEN_URI, AUTH_URI } from "../config/entrypoints";
import { Violation } from "../types/Violation";
import { DataAccess } from "../utils/dataAccess";

/**
 * Authenticate the User with the credentials provided.
 * 
 * @param email The User's email
 * @param password The User's password
 */
function authenticate(email: string, password: string): Promise<[boolean, Record<string, any | Violation>]> {
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
function refreshToken() {
    return DataAccess.request(AUTH_REFRESH_TOKEN_URI, { method: "POST" });
}

function revokeRefreshToken() {
    return DataAccess.request(AUTH_REVOKE_REFRESH_TOKEN_URI, { method: "POST" });
}

export { authenticate, refreshToken, revokeRefreshToken };