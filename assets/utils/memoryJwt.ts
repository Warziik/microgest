import { Dispatch, SetStateAction } from "react";

/**
 * Store the authentication JWT Token in the memory.
 */
export default class MemoryJwt {
    private static token: string | null = null;

    public static init(setIsAuthenticated: Dispatch<SetStateAction<boolean>>): void {
        window.addEventListener("storage", (event: StorageEvent) => {
            if (event.key === "microgest_logout") {
                MemoryJwt.setToken(null);
                setIsAuthenticated(false);
            }
        })
    }

    public static setToken(value: string | null): void {
        this.token = value;
    }

    public static getToken(): string | null {
        return this.token;
    }

    public static eraseToken(): void {
        this.token = null;
        window.localStorage.setItem('microgest_logout', Date.now().toString());
    }
}