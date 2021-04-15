import React from 'react';
import {render, screen} from "@testing-library/react";
import TextInput from '../../../components/form/TextInput';

describe("Text Input", () => {
    it("should render a text input", () => {
        render(<TextInput name="firstname" error={undefined} />);
        
        const input: HTMLElement = screen.getByRole("textbox");

        expect(input).toBeInTheDocument();
        expect(input.tagName).toBe("INPUT");
        expect(input).toHaveAttribute("name", "firstname");
    });

    it("should render a text input with a label", () => {
        render(<TextInput label="Adresse email" name="email" error={undefined} />);

        const label: HTMLElement = screen.getByText("Adresse email");

        expect(label).toBeInTheDocument();
        expect(label.tagName).toBe("LABEL");
    });

    it("should render an email input", () => {
        render(<TextInput type="email" name="email" error={undefined} />);

        const input: HTMLElement = screen.getByRole("textbox");

        expect(input).toBeInTheDocument();
        expect(input?.tagName).toBe("INPUT");
        expect(input).toHaveAttribute("type", "email");
        expect(input).toHaveAttribute("name", "email");
    });
});