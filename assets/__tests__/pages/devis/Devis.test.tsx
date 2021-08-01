import React from "react";
import { render, screen } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";
import { MemoryRouter } from "react-router";
import "../../../config/config";
import { act } from "react-dom/test-utils";
import { Devis } from "../../../pages/devis/Devis";

fetchMock.enableMocks();
fetchMock.mockResponse(
  JSON.stringify({
    "hydra:member": [
      {
        id: 1,
        chrono: "D-2021-000001",
        status: "NEW",
        customer: {
          id: 1,
          firstname: "Foo",
          lastname: "Bar",
        },
        sentAt: "2021-03-26T11:48:18+00:00",
        paidAt: null,
        paymentDeadline: "2021-03-26T11:48:18+00:00",
        validityDate: "2021-03-26T11:48:18+00:00",
        workStartDate: "2021-03-26T11:48:18+00:00",
        workDuration: "2 weeks",
        paymentDelayRate: 0,
        services: [{ name: "", quantity: 1, unitPrice: 0 }],
        tvaApplicable: true,
        isDraft: false,
        createdAt: "2021-03-26T11:48:18+00:00",
      },
      {
        id: 2,
        chrono: "D-2021-000002",
        status: "NEW",
        customer: {
          id: 1,
          firstname: "Foo",
          lastname: "Bar",
        },
        sentAt: "2021-03-26T11:48:18+00:00",
        paidAt: null,
        paymentDeadline: "2021-03-26T11:48:18+00:00",
        validityDate: "2021-03-26T11:48:18+00:00",
        workStartDate: "2021-03-26T11:48:18+00:00",
        workDuration: "2 weeks",
        paymentDelayRate: 0,
        services: [{ name: "", quantity: 1, unitPrice: 0 }],
        tvaApplicable: true,
        isDraft: false,
        createdAt: "2021-03-26T11:48:18+00:00",
      },
    ],
  })
);

describe("Devis Page", () => {
  beforeEach(async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Devis />
        </MemoryRouter>
      );
    });
  });

  it("should display the page title", () => {
    expect(document.title).toBe("Mes devis - Microgest");
  });

  it("should render the Devis in the table", () => {
    expect(screen.getAllByText("D-2021-000001")).toHaveLength(2);
    expect(screen.getAllByText("D-2021-000001")[0].tagName).toBe("A");
    expect(screen.getAllByText("D-2021-000001")[1].tagName).toBe("A");

    expect(screen.getAllByText("D-2021-000002")).toHaveLength(2);
    expect(screen.getAllByText("D-2021-000002")[0].tagName).toBe("A");
    expect(screen.getAllByText("D-2021-000002")[1].tagName).toBe("A");
  });
});
