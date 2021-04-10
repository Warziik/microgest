import React from 'react';
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { LoginForm } from '../../../pages/auth/LoginForm';
import { MemoryRouter } from 'react-router';

const mockHistoryPush = jest.fn();

jest.mock('react-router', () => ({
    ...jest.requireActual("react-router") as Record<string, unknown>,
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

describe("Login form", () => {
    const mockSuccessCallback = jest.fn().mockResolvedValue([true, { token: "jwtToken" }]);
    const mockInvalidCredentialsCallback = jest.fn().mockResolvedValue([false, { code: 401, message: "Invalid credentials." }]);
    const mockUnconfirmedAccountCallback = jest.fn().mockResolvedValue([false, { code: 400, message: "Unconfirmed account." }]);

    it("should display required fields error", async () => {
        render(<MemoryRouter>
            <LoginForm login={mockSuccessCallback} />
        </MemoryRouter>);

        fireEvent.submit(screen.getByTestId("button"));

        expect(await screen.findAllByRole("alert")).toHaveLength(2);
        expect(mockSuccessCallback).not.toHaveBeenCalled();
    })

    it("should submit the form without errors", async () => {
        render(<MemoryRouter>
            <LoginForm login={mockSuccessCallback} />
        </MemoryRouter>);

        const emailInput: any = screen.getByLabelText("Adresse email");
        const passwordInput: any = screen.getByLabelText("Mot de passe");

        fireEvent.input(emailInput, { target: { value: "testUser@localhost.dev" } });
        fireEvent.input(passwordInput, { target: { value: "demo1234" } });
        fireEvent.submit(screen.getByTestId("button"));

        await waitFor(() => expect(screen.queryAllByRole("alert")).toHaveLength(0));

        expect(mockSuccessCallback).toHaveBeenCalledTimes(1);
        expect(mockSuccessCallback).toHaveBeenCalledWith("testUser@localhost.dev", "demo1234");

        expect(emailInput.value).toBe("");
        expect(passwordInput.value).toBe("");

        expect(mockHistoryPush).toHaveBeenCalledTimes(1);
        expect(mockHistoryPush).toHaveBeenCalledWith("/");
    })

    it("should return invalid credentials error", async () => {
        render(<MemoryRouter>
            <LoginForm login={mockInvalidCredentialsCallback} />
        </MemoryRouter>);

        const emailInput: any = screen.getByLabelText("Adresse email");
        const passwordInput: any = screen.getByLabelText("Mot de passe");

        fireEvent.input(emailInput, { target: { value: "invalid_email@localhost.dev" } });
        fireEvent.input(passwordInput, { target: { value: "demo1234" } });

        await act(async () => {
            fireEvent.submit(screen.getByTestId("button"));
        })

        expect(mockInvalidCredentialsCallback).toHaveBeenCalled();
        expect(mockInvalidCredentialsCallback).toHaveBeenCalledWith("invalid_email@localhost.dev", "demo1234");
    })

    it("should return unconfirmed account error", async () => {
        render(<MemoryRouter>
            <LoginForm login={mockUnconfirmedAccountCallback} />
        </MemoryRouter>);

        const emailInput: any = screen.getByLabelText("Adresse email");
        const passwordInput: any = screen.getByLabelText("Mot de passe");

        fireEvent.input(emailInput, { target: { value: "unconfirmedUser@localhost.dev" } });
        fireEvent.input(passwordInput, { target: { value: "demo1234" } });

        await act(async () => {
            fireEvent.submit(screen.getByTestId("button"));
        })

        expect(mockUnconfirmedAccountCallback).toHaveBeenCalled();
        expect(mockUnconfirmedAccountCallback).toHaveBeenCalledWith("unconfirmedUser@localhost.dev", "demo1234");
        expect(emailInput.value).toBe("");
        expect(passwordInput.value).toBe("");
    })
})