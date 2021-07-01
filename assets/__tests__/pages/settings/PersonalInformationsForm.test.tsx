import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PersonalInformationsForm } from "../../../pages/settings/PersonalInformationsForm";

describe("Settings Personal informations form", () => {
  beforeEach(() => {
    render(<PersonalInformationsForm />);
  });

  it("should display too short value error", async () => {
    const firstnameInput: HTMLElement = screen.getByRole("textbox", {
      name: "Prénom",
    });
    const lastnameInput: HTMLElement = screen.getByRole("textbox", {
      name: "Nom de famille",
    });

    fireEvent.input(firstnameInput, { target: { value: "" } });
    fireEvent.input(lastnameInput, { target: { value: "" } });

    fireEvent.submit(screen.getByText("Mettre à jour"));

    expect(await screen.findAllByRole("alert")).toHaveLength(2);
    expect(
      screen.getByText("Le prénom doit contenir au minimum 3 caractères.")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Le nom de famille doit contenir au minimum 3 caractères."
      )
    ).toBeInTheDocument();
  });
});
