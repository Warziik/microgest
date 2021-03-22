import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { authenticate } from "../services/AuthService";
import { Violation } from "../types/Violation";
import MemoryJwt from "../utils/memoryJwt";

export function useAuth() {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

    const login = async (email: string, password: string): Promise<[boolean, Record<string, any | Violation>]> => {
        const [isSuccess, data] = await authenticate(email, password);

        if (isSuccess) {
            MemoryJwt.setToken(data.token);
            setIsAuthenticated(true);
        }

        return [isSuccess, data];
    }

    const logout = () => {
        MemoryJwt.eraseToken();
        setIsAuthenticated(false);
    }

    return {
        login,
        logout,
        isAuthenticated
    }
}