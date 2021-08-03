import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SecurityForm } from "../../../pages/settings/SecurityForm";

describe("Settings Security form", () => {
  beforeEach(() => {
    render(<SecurityForm />);
  });

  it("should display fields errors", async () => {
    fireEvent.submit(screen.getByText("Mettre à jour"));

    expect(await screen.findAllByRole("alert")).toHaveLength(2);
    expect(
      screen.getByText("Le mot de passe doit contenir au minimum 3 caractères.")
    ).toBeInTheDocument();
    expect(screen.getByText("Ce champ est requis.")).toBeInTheDocument();
  });

  it("should display not same values error", async () => {
    const passwordInput: HTMLElement = screen.getByLabelText(
      "Nouveau mot de passe"
    );
    const passwordConfirmInput: HTMLElement = screen.getByLabelText(
      "Confirmez votre nouveau mot de passe"
    );

    fireEvent.input(passwordInput, { target: { value: "foo" } });
    fireEvent.input(passwordConfirmInput, { target: { value: "bar" } });

    fireEvent.submit(screen.getByText("Mettre à jour"));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Les mots de passe ne correspondent pas."
    );
  });
});
