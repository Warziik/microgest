import jwtDecode from "jwt-decode";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { authenticate, revokeRefreshToken } from "../services/AuthService";
import { JwtToken } from "../types/JwtToken";
import { Violation } from "../types/Violation";
import MemoryJwt from "../utils/memoryJwt";

export function useAuth() {
  const { isAuthenticated, setIsAuthenticated, userData, setUserData } =
    useContext(AuthContext);

  const login = async (
    email: string,
    password: string
  ): Promise<[boolean, Record<string, any | Violation>]> => {
    const [isSuccess, data] = await authenticate(email, password);

    if (isSuccess) {
      const decodedToken: JwtToken = jwtDecode(data.token);
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
    }

    return [isSuccess, data];
  };

  const logout = async () => {
    const [isSuccess, data] = await revokeRefreshToken();

    if (isSuccess) {
      MemoryJwt.eraseToken();
      setIsAuthenticated(false);
    }

    return [isSuccess, data];
  };

  return {
    login,
    logout,
    isAuthenticated,
    userData,
    setUserData,
  };
}
