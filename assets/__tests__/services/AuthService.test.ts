import * as AuthService from "../../services/AuthService";
import fetchMock from "jest-fetch-mock";
import { User } from "../../types/User";

fetchMock.enableMocks();

describe("AuthService", () => {
    const userLoginCredentials: User = {
        email: "testUser@localhost.dev",
        password: "demo1234"
    }

    it("should login the User", async () => {
        fetchMock.mockResponse(JSON.stringify(userLoginCredentials));
        expect(await AuthService.signin("testUser@localhost.dev", "demo1234")).toStrictEqual([true, userLoginCredentials]);
    })
})