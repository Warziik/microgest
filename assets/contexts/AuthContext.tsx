import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { UserData } from "../types/User";
import MemoryJwt from "../utils/memoryJwt";
import { refreshToken } from "../services/AuthService";
import { Spinner } from "../components/Spinner";
import jwtDecode from "jwt-decode";
import { JwtToken } from "../types/JwtToken";

type InitialType = {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  userData: UserData;
  setUserData: Dispatch<SetStateAction<UserData>>;
};

export const AuthContext = createContext<InitialType>({
  userData: {
    id: 0,
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    businessName: "",
    siret: "",
    tvaNumber: "",
    address: "",
    city: "",
    postalCode: 0,
    country: "",
    createdAt: "",
  },
  setUserData: (value: SetStateAction<UserData>) => value,
  isAuthenticated: false,
  setIsAuthenticated: (value: SetStateAction<boolean>) => value,
});

type Props = {
  children: ReactNode;
};

export function AuthContextProvider({ children }: Props) {
  const [isWorking, setIsWorking] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    MemoryJwt.getToken() !== null
  );
  const [userData, setUserData] = useState<UserData>({
    id: 0,
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    businessName: "",
    siret: "",
    tvaNumber: "",
    address: "",
    city: "",
    postalCode: 0,
    country: "",
    createdAt: "",
  });

  const refreshAuthToken = useCallback(async () => {
    const [isSuccess, data] = await refreshToken();

    if (isSuccess) {
      const decodedToken: JwtToken = jwtDecode(data.token);
      const expiresIn =
        decodedToken.exp - Math.floor(new Date().getTime() / 1000);

      MemoryJwt.setToken(data.token);
      setUserData({
        id: decodedToken.id,
        firstname: data.userData.firstname,
        lastname: data.userData.lastname,
        email: data.userData.email,
        phone: data.userData.phone,
        businessName: data.userData.businessName,
        siret: data.userData.siret,
        tvaNumber: data.userData.tvaNumber,
        address: data.userData.address,
        city: data.userData.city,
        postalCode: data.userData.postalCode,
        country: data.userData.country,
        createdAt: data.userData.createdAt,
      });
      setIsAuthenticated(true);

      setTimeout(() => {
        refreshAuthToken();
      }, expiresIn * 1000 - 500);
    }
    setIsWorking(false);
  }, []);

  MemoryJwt.init(setIsAuthenticated);

  useEffect(() => {
    refreshAuthToken();
  }, [refreshAuthToken]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, userData, setUserData }}
    >
      {isWorking ? (
        <div className="defaultLoading">
          <Spinner />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
