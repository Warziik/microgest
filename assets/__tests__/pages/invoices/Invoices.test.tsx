import React from "react";
import { render, screen } from "@testing-library/react";
import { Invoices } from "../../../pages/invoices/Invoices";
import fetchMock from "jest-fetch-mock";
import { MemoryRouter } from "react-router";
import "../../../config/config";
import { act } from "react-dom/test-utils";

fetchMock.enableMocks();
fetchMock.mockResponse(
  JSON.stringify({
    "hydra:member": [
      {
        id: 1,
        chrono: "F-2021-000001",
        amount: 441.7,
        status: "NEW",
        customer: {
          id: 1,
          firstname: "Foo",
          lastname: "Bar",
        },
        sentAt: "2021-03-26T11:48:18+00:00",
        paidAt: null,
        paymentDeadline: "2021-03-26T11:48:18+00:00",
      },
      {
        id: 2,
        chrono: "F-2021-000002",
        amount: 20.7,
        status: "NEW",
        customer: {
          id: 2,
          firstname: "Bar",
          lastname: "Foo",
        },
        sentAt: "2021-03-26T11:48:18+00:00",
        paidAt: null,
        paymentDeadline: "2021-03-26T11:48:18+00:00",
      },
    ],
  })
);

describe("Invoices Page", () => {
  beforeEach(async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Invoices />
        </MemoryRouter>
      );
    });
  });

  it("should display the page title", () => {
    expect(document.title).toBe("Mes factures - Microgest");
  });

  it("should render the Invoices in the table", () => {
    expect(screen.getAllByText("F-2021-000001")).toHaveLength(2);
    expect(screen.getAllByText("F-2021-000001")[0].tagName).toBe("A");
    expect(screen.getAllByText("F-2021-000001")[1].tagName).toBe("A");

    expect(screen.getAllByText("F-2021-000002")).toHaveLength(2);
    expect(screen.getAllByText("F-2021-000002")[0].tagName).toBe("A");
    expect(screen.getAllByText("F-2021-000002")[1].tagName).toBe("A");
  });
});
