import React, { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useEffect, useState } from "react";
import { User } from "../types/User";
import MemoryJwt from "../utils/memoryJwt";
import { refreshToken } from "../services/AuthService";
import { Loader } from "../components/Loader";
import jwtDecode from "jwt-decode";
import { JwtToken } from "../types/JwtToken";

type InitialType = {
    isAuthenticated: boolean;
    setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
    userData: User;
    setUserData: Dispatch<SetStateAction<User>>;
}

export const AuthContext = createContext<InitialType>({
    userData: { id: 0, firstname: "", lastname: "", email: "" },
    setUserData: (value: SetStateAction<User>) => value,
    isAuthenticated: false,
    setIsAuthenticated: (value: SetStateAction<boolean>) => value
});

type Props = {
    children: ReactNode;
}

export function AuthContextProvider({ children }: Props) {
    const [isWorking, setIsWorking] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(MemoryJwt.getToken() !== null);
    const [userData, setUserData] = useState<User>({ id: 0, firstname: "", lastname: "", email: "" });

    const refreshAuthToken = useCallback(async () => {
        const [isSuccess, data] = await refreshToken();

        if (isSuccess) {
            const decodedToken: JwtToken = jwtDecode(data.token);
            const expiresIn = decodedToken.exp - Math.floor((new Date().getTime() / 1000));

            MemoryJwt.setToken(data.token);
            setUserData({
                id: decodedToken.id,
                firstname: decodedToken.firstname,
                lastname: decodedToken.lastname,
                email: decodedToken.username
            });
            setIsAuthenticated(true);
            setIsWorking(false);

            setTimeout(() => {
                refreshAuthToken();
            }, (expiresIn * 1000) - 500);
        }
    }, []);

    MemoryJwt.init(setIsAuthenticated);

    useEffect(() => {
        refreshAuthToken();
    }, [refreshAuthToken]);

    return <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userData, setUserData }}>
        {isWorking ? <div className="defaultLoading">
            <Loader />
        </div> : children}
    </AuthContext.Provider>
}