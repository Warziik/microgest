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

    const userLoginCredentials: User = {
        email: "testUser@localhost.dev",
        password: "demo1234"
    }

    const violations: Violation[] = [
        {propertyPath: "firstname", message: "Error message", code: "code"}
    ];

    it("should create a User", async () => {
        fetchMock.mockResponse(JSON.stringify(userRegistrationCredentails));
        expect(await AuthService.signup(userRegistrationCredentails)).toStrictEqual([true, userRegistrationCredentails]);
    })

    it("should return a validation error", async () => {
        fetchMock.mockResponse(JSON.stringify({violations}));
        expect(await AuthService.signup(userRegistrationCredentails)).toStrictEqual([true, {violations}]);
    })

    it("should login the User", async () => {
        fetchMock.mockResponse(JSON.stringify(userLoginCredentials));
        expect(await AuthService.signin("testUser@localhost.dev", "demo1234")).toStrictEqual([true, userLoginCredentials]);
    })

    it("should confirm the User's account", async () => {
        fetchMock.mockResponse(JSON.stringify({code: 200, message: "Account confirmed successfully."}));
        expect(await AuthService.confirmAccount(1, "randomToken")).toStrictEqual([true, {code: 200, message: "Account confirmed successfully."}]);
    })
})