import React from 'react';
import {render, screen} from "@testing-library/react";
import Auth from '../../pages/Auth';

describe("Auth page", () => {
    it("should display the page title", () => {
        render(<Auth />);
        const pageTitle = screen.getByText("Créer un compte");
        expect(pageTitle).toBeInTheDocument();
    })
})