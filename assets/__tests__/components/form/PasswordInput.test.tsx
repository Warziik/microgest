import React from 'react';
import {render, fireEvent, screen} from "@testing-library/react";
import PasswordInput from '../../../components/form/PasswordInput';

describe("Password Input", () => {
    it("should render a password input", () => {
        render(<PasswordInput name="password" label="Mot de passe" error={undefined} />);

        const input: HTMLElement = screen.getByLabelText("Mot de passe");

        expect(input).toBeInTheDocument();
        expect(input?.tagName).toBe("INPUT");
        expect(input).toHaveAttribute("type", "password");
        expect(input).toHaveAttribute("name", "password");
    });

    it("should render a password input with a label", () => {
        render(<PasswordInput name="password" label="Mot de passe" error={undefined} />);

        const label: HTMLElement = screen.getByText("Mot de passe");

        expect(label).toBeInTheDocument();
        expect(label.tagName).toBe("LABEL");
    });

    it("should toggle password visibility", () => {
        render(<PasswordInput name="password" label="Mot de passe" error={undefined} />);

        const input: HTMLElement = screen.getByLabelText("Mot de passe");
        const actionBtn: HTMLElement = screen.getByRole("button");

        fireEvent.click(actionBtn);

        expect(input).toBeInTheDocument();
        expect(actionBtn).toBeInTheDocument();
        expect(input).toHaveAttribute("type", "text");

        fireEvent.click(actionBtn);
        expect(input).toHaveAttribute("type", "password");
        
        expect(input).toHaveAttribute("name", "password");
    });
});