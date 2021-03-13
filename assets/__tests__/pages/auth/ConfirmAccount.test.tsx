import React from "react";
import { render } from "@testing-library/react"
import ConfirmAccount from "../../../pages/auth/ConfirmAccount"

const mockHistoryPush = jest.fn();

jest.mock('react-router', () => ({
    useHistory: () => ({
        push: mockHistoryPush,
    }),
    useParams: () => ({
        id: "invalid_id",
        token: "token"
    })
}));

describe("Account confirmation", () => {
    beforeEach(() => render(<ConfirmAccount />));

    it("should redirect due to an invalid user id", () => {
        expect(mockHistoryPush).toHaveBeenCalledTimes(1);
        expect(mockHistoryPush).toHaveBeenCalledWith("/connexion");
    })
})