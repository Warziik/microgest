import React from 'react';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AddCustomerForm } from '../../../pages/customers/AddCustomerForm';
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();
fetchMock.mockResponse(JSON.stringify([true, {}]));

describe("Add Customer form", () => {
    const mockCreateCustomer = jest.fn();

    beforeEach(() => {
        render(<AddCustomerForm addCustomer={mockCreateCustomer} />);
    });

    it("should display input errors", async () => {
        fireEvent.submit(screen.getByTestId("button"));

        expect(await screen.findAllByRole("alert")).toHaveLength(3);
        expect(mockCreateCustomer).not.toHaveBeenCalled();
    });

    it("should submit the form without errors", async () => {
        const firstnameInput: any = screen.getByRole("textbox", { name: "Prénom" });
        const lastnameInput: any = screen.getByRole("textbox", { name: "Nom de famille" });
        const emailInput: any = screen.getByRole("textbox", { name: /email/i });
        const companyInput: any = screen.getByLabelText("Entreprise");

        fireEvent.input(firstnameInput, { target: { value: "Foo" } });
        fireEvent.input(lastnameInput, { target: { value: "Bar" } });
        fireEvent.input(emailInput, { target: { value: "foo@bar.dev" } });
        fireEvent.input(companyInput, { target: { value: "Oui" } });

        fireEvent.submit(screen.getByRole("button"));

        await waitFor(() => expect(screen.queryAllByRole("alert")).toHaveLength(0));
        expect(mockCreateCustomer).toHaveBeenCalledTimes(1);
        expect(firstnameInput.value).toBe("");
        expect(lastnameInput.value).toBe("");
        expect(emailInput.value).toBe("");
        expect(companyInput.value).toBe("");
    });
});