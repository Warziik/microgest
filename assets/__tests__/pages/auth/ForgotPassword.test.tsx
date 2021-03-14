import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react"
import ForgotPassword from "../../../pages/auth/ForgotPassword"
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

describe("Forgot password page", () => {
    beforeEach(() => render(<ForgotPassword />));

    it("should return an input error", async () => {
        fireEvent.submit(screen.getByText("Envoyer"));

        expect(await screen.findAllByRole("alert")).toHaveLength(1);
    })

    it("should submit the form successfully", async () => {
        fetchMock.mockResponse(JSON.stringify({}));

        fireEvent.input(screen.getByRole("textbox", { name: /email/i }), { target: { value: "testUser@localhost.dev" } });

        await act(async () => {
            fireEvent.submit(screen.getByText("Envoyer"));
        })

        expect(screen.queryAllByRole("alert")).toHaveLength(0);
    })
})