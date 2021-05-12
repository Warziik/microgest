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

        expect(await screen.findAllByRole("alert")).toHaveLength(9);
        expect(mockCreateUser).not.toHaveBeenCalled();
    })

    it("should submit the form without errors", async () => {
        const firstnameInput: any = screen.getByRole("textbox", { name: "Prénom" });
        const lastnameInput: any = screen.getByRole("textbox", { name: "Nom de famille" });
        const emailInput: any = screen.getByRole("textbox", { name: "Adresse email" });
        const passwordInput: any = screen.getByLabelText("Mot de passe");
        const confirmPasswordInput: any = screen.getByLabelText("Confirmez votre mot de passe");
        const phoneInput: any = screen.getByRole("textbox", { name: "Numéro de téléphone (facultatif)" });
        const businessNameInput: any = screen.getByRole("textbox", { name: "Nom commercial (facultatif)" });
        const siretInput: any = screen.getByLabelText("Numéro SIRET");
        const tvaNumberInput: any = screen.getByRole("textbox", { name: "Numéro de TVA (facultatif)" });
        const addressInput: any = screen.getByRole("textbox", { name: "Adresse" });
        const cityInput: any = screen.getByRole("textbox", { name: "Ville" });
        const postalCodeInput: any = screen.getByLabelText("Code postal");

        fireEvent.input(firstnameInput, { target: { value: "Alex" } });
        fireEvent.input(lastnameInput, { target: { value: "Lastname" } });
        fireEvent.input(emailInput, { target: { value: "demoUser@localhost.dev" } });
        fireEvent.input(passwordInput, { target: { value: "demo1234" } });
        fireEvent.input(confirmPasswordInput, { target: { value: "demo1234" } });
        fireEvent.input(phoneInput, { target: { value: "0000000000" } });
        fireEvent.input(businessNameInput, { target: { value: "DemOCompany" } });
        fireEvent.input(siretInput, { target: { value: 12345678912345 } });
        fireEvent.input(tvaNumberInput, { target: { value: "FR00123456789" } });
        fireEvent.input(addressInput, { target: { value: "119 avenue Aléatoire" } });
        fireEvent.input(cityInput, { target: { value: "Paris" } });
        fireEvent.input(postalCodeInput, { target: { value: 75000 } });

        fireEvent.submit(screen.getByTestId("button"));

        await waitFor(() => expect(screen.queryAllByRole("alert")).toHaveLength(0));
        expect(mockCreateUser).toHaveBeenCalledTimes(1);
        expect(mockCreateUser).toHaveBeenCalledWith({
            firstname: "Alex",
            lastname: "Lastname",
            email: "demoUser@localhost.dev",
            password: "demo1234",
            passwordConfirm: "demo1234",
            phone: "0000000000",
            businessName: "DemOCompany",
            siret: "12345678912345",
            tvaNumber: "FR00123456789",
            address: "119 avenue Aléatoire",
            city: "Paris",
            postalCode: 75000,
            country: "FRA"
        });
        expect(firstnameInput.value).toBe("");
        expect(lastnameInput.value).toBe("");
        expect(emailInput.value).toBe("");
        expect(passwordInput.value).toBe("");
        expect(confirmPasswordInput.value).toBe("");
        expect(phoneInput.value).toBe("");
        expect(businessNameInput.value).toBe("");
        expect(siretInput.value).toBe("");
        expect(tvaNumberInput.value).toBe("");
        expect(addressInput.value).toBe("");
        expect(cityInput.value).toBe("");
        expect(postalCodeInput.value).toBe("");
    })
})