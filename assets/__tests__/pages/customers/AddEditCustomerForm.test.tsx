import React from 'react';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AddEditCustomerForm } from '../../../pages/customers/AddEditCustomerForm';
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();
fetchMock.mockResponse(JSON.stringify([true, {}]));

describe("Add Edit Customer form", () => {
    const mockChangeCustomer = jest.fn();
    const customerToEdit = {
        "@context": "",
        "@type": "Customer",
        "@id": "0",
        id: 0,
        firstname: "Foo",
        lastname: "Bar",
        email: "fooBar@localhost.dev",
        company: "",
        createdAt: "",
        updatedAt: ""
    }

    it("should display input errors when its Add", async () => {
        render(<AddEditCustomerForm changeCustomer={mockChangeCustomer} />);

        fireEvent.submit(screen.getByTestId("button"));

        expect(await screen.findAllByRole("alert")).toHaveLength(3);
        expect(mockChangeCustomer).not.toHaveBeenCalled();
    });

    it("should not display input errors when its Edit due to default values", async () => {
        render(<AddEditCustomerForm changeCustomer={mockChangeCustomer} customerToEdit={customerToEdit} />);

        const firstnameInput: any = screen.getByRole("textbox", { name: "Prénom" });
        const lastnameInput: any = screen.getByRole("textbox", { name: "Nom de famille" });
        const emailInput: any = screen.getByRole("textbox", { name: /email/i });
        const companyInput: any = screen.getByLabelText("Entreprise");

        fireEvent.submit(screen.getByTestId("button"));

        await waitFor(() => expect(screen.queryAllByRole("alert")).toHaveLength(0));
        expect(firstnameInput.value).toBe("Foo");
        expect(lastnameInput.value).toBe("Bar");
        expect(emailInput.value).toBe("fooBar@localhost.dev");
        expect(companyInput.value).toBe("");
    });

    it("should submit the form when its Add", async () => {
        render(<AddEditCustomerForm changeCustomer={mockChangeCustomer} />);

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
        expect(mockChangeCustomer).toHaveBeenCalled();
        expect(firstnameInput.value).toBe("");
        expect(lastnameInput.value).toBe("");
        expect(emailInput.value).toBe("");
        expect(companyInput.value).toBe("");
    });
});