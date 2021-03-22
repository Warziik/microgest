import React, { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { User } from "../types/User";
import MemoryJwt from "../utils/memoryJwt";

type InitialType = {
    isAuthenticated: boolean;
    setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
    userData: User | null;
    setUserData: Dispatch<SetStateAction<User | null>>;
}

export const AuthContext = createContext<InitialType>({
    userData: null,
    setUserData: (value: SetStateAction<User | null>) => value,
    isAuthenticated: false,
    setIsAuthenticated: (value: SetStateAction<boolean>) => value
});

type Props = {
    children: ReactNode;
}

export function AuthContextProvider({ children }: Props) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(MemoryJwt.getToken() !== null);
    const [userData, setUserData] = useState<User | null>(null);

    useEffect(() => {
        MemoryJwt.init(setIsAuthenticated);
    }, []);

    return <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userData, setUserData }}>
        {children}
    </AuthContext.Provider>
}