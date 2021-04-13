import React from 'react';
import { render, screen } from "@testing-library/react";
import { Invoices } from "../../../pages/invoices/Invoices";
import fetchMock from "jest-fetch-mock";
import { MemoryRouter } from 'react-router';
import "../../../config/config";
import { act } from 'react-dom/test-utils';

fetchMock.enableMocks();
fetchMock.mockResponse(JSON.stringify({
    "allInvoices": [
        {
            id: 1,
            chrono: "2021-0001",
            amount: 441.7,
            status: "NEW",
            customer: {
                id: 1,
                firstname: "Foo",
                lastname: "Bar"
            },
            sentAt: "2021-03-26T11:48:18+00:00",
            paidAt: null
        },
        {
            id: 2,
            chrono: "2021-0002",
            amount: 20.7,
            status: "NEW",
            customer: {
                id: 2,
                firstname: "Bar",
                lastname: "Foo"
            },
            sentAt: "2021-03-26T11:48:18+00:00",
            paidAt: null
        }
    ]
}));

describe("Invoices Page", () => {
    beforeEach(async () => {
        await act( async () => {
            render(<MemoryRouter>
                <Invoices />
            </MemoryRouter>);
        })
    });

    it("should display the page title", () => {
        expect(document.title).toBe("Mes factures - Microgest");
    });

    it("should render the Invoices in the table", () => {
        expect(screen.getByText("2021-0001")).toBeInTheDocument();
        expect(screen.getByText("2021-0001").tagName).toBe("A");
        
        expect(screen.getByText("2021-0002")).toBeInTheDocument();
        expect(screen.getByText("2021-0002").tagName).toBe("A");
    });
});