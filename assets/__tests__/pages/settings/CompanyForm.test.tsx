import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CompanyForm } from "../../../pages/settings/CompanyForm";

describe("Settings Company form", () => {
  beforeEach(() => {
    render(<CompanyForm />);
  });

  it("should display incorrect siret error", async () => {
    fireEvent.submit(screen.getByText("Mettre à jour"));

    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(
      screen.getByText("Le numéro SIRET doit contenir 14 chiffres.")
    ).toBeInTheDocument();
  });

  it("should display too long tvaNumber error", async () => {
    const tvaNumberInput: HTMLElement = screen.getByRole("textbox", {
      name: "Numéro de TVA (facultatif)",
    });
    fireEvent.input(tvaNumberInput, { target: { value: "12345678912345" } });
    fireEvent.submit(screen.getByText("Mettre à jour"));

    expect(await screen.findAllByRole("alert")).toHaveLength(2);
    expect(
      screen.getByText("Le numéro de TVA ne peut dépasser 13 caractères.")
    ).toBeInTheDocument();
  });
});
