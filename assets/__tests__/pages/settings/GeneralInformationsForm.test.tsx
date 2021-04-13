import React from 'react';
import { render, screen, fireEvent } from "@testing-library/react";
import { GeneralInformationsForm } from '../../../pages/settings/GeneralInformationsForm';

describe("Settings General informations form", () => {
    beforeEach(() => {
        render(<GeneralInformationsForm />);
    });

    it("should display too short value error", async () => {
        const firstnameInput: HTMLElement = screen.getByRole("textbox", { name: "Prénom" });
        const lastnameInput: HTMLElement = screen.getByRole("textbox", { name: "Nom de famille" });

        fireEvent.input(firstnameInput, { target: { value: "" } });
        fireEvent.input(lastnameInput, { target: { value: "" } });

        fireEvent.submit(screen.getByText("Sauvegarder"));

        expect(await screen.findAllByRole("alert")).toHaveLength(2);
        expect(screen.getByText("Le prénom doit contenir au minimum 3 caractères.")).toBeInTheDocument();
        expect(screen.getByText("Le nom de famille doit contenir au minimum 3 caractères.")).toBeInTheDocument();
    });
});