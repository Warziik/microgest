import { authenticate } from "../../services/AuthService";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

describe("AuthService", () => {
    const userLoginCredentials = {
        email: "testUser@localhost.dev",
        password: "demo1234"
    }

    it("should login the User", async () => {
        fetchMock.mockResponse(JSON.stringify(userLoginCredentials));
        expect(await authenticate("testUser@localhost.dev", "demo1234")).toStrictEqual([true, userLoginCredentials]);
    })
})