import { render as rtlRender, screen } from '@testing-library/react';
import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Settings } from '../../../pages/settings/Settings';

describe("Settings Page", () => {
    const render = (ui: JSX.Element, { route = '/' } = {}) => {
        window.history.pushState({}, 'Test page', route)

        return rtlRender(ui, { wrapper: BrowserRouter })
    }

    it("should display the expected page title", () => {
        render(<Settings />);

        expect(document.title).toBe("Mes paramètres - Microgest");
    });

    it("should display the general informations tab", () => {
        render(<Settings />, { route: "/paramètres" });

        expect(screen.getByText("Informations générales")).toBeInTheDocument();
        expect(screen.getByText("Informations générales")).toHaveAttribute("aria-selected", "true");
        expect(screen.getByText("Sécurité")).toHaveAttribute("aria-selected", "false");
    });

    it("should display the security tab", () => {
        render(<Settings />, { route: "/paramètres/sécurité" });

        expect(screen.getByText("Sécurité")).toBeInTheDocument();
        expect(screen.getByText("Sécurité")).toHaveAttribute("aria-selected", "true");
        expect(screen.getByText("Informations générales")).toHaveAttribute("aria-selected", "false");
    });
});