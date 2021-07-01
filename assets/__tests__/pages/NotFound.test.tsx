import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { NotFound } from "../../pages/NotFound";

test("render not found page", () => {
  render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>
  );

  const title: HTMLElement = screen.getByText("404 Page introuvable");

  expect(title).toBeInTheDocument();
  expect(title.tagName).toBe("H1");
});
