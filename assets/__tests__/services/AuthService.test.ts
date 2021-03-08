import * as AuthService from "../../services/AuthService";
import fetchMock from "jest-fetch-mock";
import { User } from "../../types/User";
import { Violation } from "../../types/Violation";

fetchMock.enableMocks();

describe("AuthService", () => {
    const userRegistrationCredentails: User = {
        firstname: "Demo",
        lastname: "User",
        email: "demoUser@localhost.dev",
        password: "demo1234"
    };

    const violations: Violation[] = [
        {propertyPath: "firstname", message: "Error message", code: "code"}
    ];

    it("should create a User", async () => {
        fetchMock.mockResponse(JSON.stringify(userRegistrationCredentails));
        expect(await AuthService.register(userRegistrationCredentails)).toStrictEqual([true, userRegistrationCredentails]);
    })

    it("should return a validation error", async () => {
        fetchMock.mockResponse(JSON.stringify({violations}));
        expect(await AuthService.register(userRegistrationCredentails)).toStrictEqual([true, {violations}]);
    })
})
