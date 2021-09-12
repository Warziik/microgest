import React from 'react';
import {render, screen, fireEvent} from "@testing-library/react";
import {AddEditCustomerForm} from '../../../pages/customers/AddEditCustomerForm';

describe("Add Edit Customer form", () => {
    const mockChangeCustomer = jest.fn();

    it("should display input errors when its Add", async () => {
        render(<AddEditCustomerForm changeCustomer={mockChangeCustomer}/>);

        fireEvent.submit(screen.getByTestId("button"));

        expect(await screen.findAllByRole("alert")).toHaveLength(7);
        expect(mockChangeCustomer).not.toHaveBeenCalled();
    });
});