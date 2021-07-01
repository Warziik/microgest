import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { ResetPassword } from "../../../pages/auth/ResetPassword";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

const mockHistoryPush = jest.fn();

jest.mock("react-router", () => ({
  useHistory: () => ({ push: mockHistoryPush }),
  useParams: () => ({ token: "token" }),
}));

describe("ResetPassword page", () => {
  beforeEach(() => render(<ResetPassword />));

  it("should return 2 input errors", async () => {
    fireEvent.submit(screen.getByTestId("button"));

    expect(await screen.findAllByRole("alert")).toHaveLength(2);
  });

  it("should redirect after password changed", async () => {
    fetchMock.mockResponse(JSON.stringify({}));

    fireEvent.input(screen.getByLabelText("Nouveau mot de passe"), {
      target: { value: "password123" },
    });
    fireEvent.input(
      screen.getByLabelText("Confirmez votre nouveau mot de passe"),
      { target: { value: "password123" } }
    );

    await act(async () => {
      fireEvent.submit(screen.getByTestId("button"));
    });

    expect(screen.queryAllByRole("alert")).toHaveLength(0);

    expect(mockHistoryPush).toHaveBeenCalledTimes(1);
    expect(mockHistoryPush).toHaveBeenCalledWith("/");
  });
});
