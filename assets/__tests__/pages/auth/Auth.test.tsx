import React from 'react';
import { render as rtlRender, screen } from "@testing-library/react";
import Auth from '../../../pages/auth/Auth';
import { BrowserRouter } from 'react-router-dom';

describe("Auth page", () => {
    const render = (ui: JSX.Element, { route = '/' } = {}) => {
        window.history.pushState({}, 'Test page', route)

        return rtlRender(ui, { wrapper: BrowserRouter })
    }

    it("should display the register tab", () => {
        render(<Auth />, { route: "/inscription" });

        expect(screen.getAllByText("Créer mon compte")).toHaveLength(3);
    })

    it("should display the login tab", () => {
        render(<Auth />, { route: "/connexion" });

        expect(screen.getAllByText("Se connecter")).toHaveLength(3);
    })
})