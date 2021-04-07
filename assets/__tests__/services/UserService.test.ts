import * as UserService from "../../services/UserService";
import fetchMock from "jest-fetch-mock";
import { Violation } from "../../types/Violation";

fetchMock.enableMocks();

describe("AuthService", () => {
    const userRegistrationCredentails = {
        firstname: "Demo",
        lastname: "User",
        email: "demoUser@localhost.dev",
        password: "demo1234"
    };

    const violations: Violation[] = [
        { propertyPath: "firstname", message: "Error message", code: "code" }
    ];

    it("should create a User", async () => {
        fetchMock.mockResponse(JSON.stringify(userRegistrationCredentails));
        expect(await UserService.signup(userRegistrationCredentails)).toStrictEqual([true, userRegistrationCredentails]);
    })

    it("should return a validation error", async () => {
        fetchMock.mockResponse(JSON.stringify({ violations }));
        expect(await UserService.signup(userRegistrationCredentails)).toStrictEqual([true, { violations }]);
    })

    it("should confirm the User's account", async () => {
        fetchMock.mockResponse(JSON.stringify({ code: 200, message: "Account confirmed successfully." }));
        expect(await UserService.confirmAccount(1, "randomToken")).toStrictEqual([true, { code: 200, message: "Account confirmed successfully." }]);
    })
})