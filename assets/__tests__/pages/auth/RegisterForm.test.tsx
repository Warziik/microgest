import React from 'react';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RegisterForm } from '../../../pages/auth/RegisterForm';

describe("Registration form", () => {
    const mockCreateUser = jest.fn().mockResolvedValue([true, {}]);

    beforeEach(() => {
        render(<RegisterForm createUser={mockCreateUser} />);
    })

    it("should display input errors", async () => {
        fireEvent.submit(screen.getByTestId("button"));

        expect(await screen.findAllByRole("alert")).toHaveLength(5);
        expect(mockCreateUser).not.toHaveBeenCalled();
    })

    it("should submit the form without errors", async () => {
        const firstnameInput: any = screen.getByRole("textbox", { name: "Prénom" });
        const lastnameInput: any = screen.getByRole("textbox", { name: "Nom de famille" });
        const emailInput: any = screen.getByRole("textbox", { name: /email/i });
        const passwordInput: any = screen.getByLabelText("Mot de passe");
        const confirmPasswordInput: any = screen.getByLabelText("Confirmez votre mot de passe");

        fireEvent.input(firstnameInput, { target: { value: "Alex" } });
        fireEvent.input(lastnameInput, { target: { value: "Lastname" } });
        fireEvent.input(emailInput, { target: { value: "demoUser@localhost.dev" } });
        fireEvent.input(passwordInput, { target: { value: "demo1234" } });
        fireEvent.input(confirmPasswordInput, { target: { value: "demo1234" } });

        fireEvent.submit(screen.getByTestId("button"));

        await waitFor(() => expect(screen.queryAllByRole("alert")).toHaveLength(0));
        expect(mockCreateUser).toHaveBeenCalledTimes(1);
        expect(mockCreateUser).toHaveBeenCalledWith({
            firstname: "Alex",
            lastname: "Lastname",
            email: "demoUser@localhost.dev",
            password: "demo1234"
        });
        expect(firstnameInput.value).toBe("");
        expect(lastnameInput.value).toBe("");
        expect(emailInput.value).toBe("");
        expect(passwordInput.value).toBe("");
        expect(confirmPasswordInput.value).toBe("");
    })
})