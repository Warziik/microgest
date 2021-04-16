import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { NotFound } from "../../pages/NotFound";

test("render not found page", () => {
    render(<MemoryRouter>
        <NotFound />
    </MemoryRouter>);

    const title: HTMLElement = screen.getByText("404 Page introuvable");
    const description: HTMLElement = screen.getByText("La page demandée n'a pu être trouvée.");

    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe("H1");

    expect(description).toBeInTheDocument();
    expect(description.tagName).toBe("P");
})