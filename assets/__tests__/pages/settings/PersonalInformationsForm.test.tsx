import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PersonalInformationsForm } from "../../../pages/settings/PersonalInformationsForm";

describe("Settings Personal informations form", () => {
  beforeEach(() => {
    render(<PersonalInformationsForm />);
  });

  it("should display fields errors", async () => {
    fireEvent.submit(screen.getByText("Mettre à jour"));

    expect(await screen.findAllByRole("alert")).toHaveLength(7);
    expect(
      screen.getByText("Le prénom doit contenir au minimum 3 caractères.")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Le nom de famille doit contenir au minimum 3 caractères."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("Le code postal doit contenir 5 chiffres.")
    ).toBeInTheDocument();
    expect(screen.getAllByText("Ce champ est requis.")).toHaveLength(4);
  });
});
