import React from "react";
import { render, screen } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";
import { MemoryRouter } from "react-router";
import "../../../config/config";
import { act } from "react-dom/test-utils";
import { Customers } from "../../../pages/customers/Customers";

fetchMock.enableMocks();
fetchMock.mockResponse(
  JSON.stringify({
    "hydra:member": [
      {
        id: 1,
        firstname: "Foo",
        lastname: "Bar",
        email: "foo@bar.dev",
        createdAt: "2021-03-26T11:48:18+00:00",
        company: "Oui",
        lastInvoice: { chrono: "0000-0001", status: "NEW" },
      },
      {
        id: 2,
        firstname: "Demo",
        lastname: "Test",
        email: "demo@test.dev",
        createdAt: "2021-03-26T11:48:18+00:00",
        company: null,
        lastInvoice: { chrono: "0000-0000", status: "NEW" },
      },
    ],
  })
);

describe("Customers Page", () => {
  beforeEach(async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Customers />
        </MemoryRouter>
      );
    });
  });

  it("should display the page title", () => {
    expect(document.title).toBe("Mes clients - Microgest");
  });

  it("should render the Customers", () => {
    expect(screen.getByText("foo@bar.dev")).toBeInTheDocument();
    expect(screen.getByText("foo@bar.dev").tagName).toBe("P");

    expect(screen.getByText("demo@test.dev")).toBeInTheDocument();
    expect(screen.getByText("demo@test.dev").tagName).toBe("P");
  });
});
