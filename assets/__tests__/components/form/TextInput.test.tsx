import React from 'react';
import {render} from "@testing-library/react";
import TextInput from '../../../components/form/TextInput';

describe("Text input", () => {
    it("should render a text input", () => {
        render(<TextInput name="firstname" error={undefined} />);
        
        const input: HTMLInputElement | null = document.querySelector("input.form__input");

        expect(input).toBeInTheDocument();
    })

    it("should render a text input with a label", () => {
        render(<TextInput label="Adresse email" name="email" error={undefined} />);

        const label: Element | null = document.querySelector("label.form__label");

        expect(label).toBeInTheDocument();
        expect(label?.textContent).toBe("Adresse email");
    })

    it("should render an email input", () => {
        render(<TextInput type="email" name="email" error={undefined} />);

        const input: HTMLInputElement | null = document.querySelector("input.form__input");

        expect(input).toBeInTheDocument();
        expect(input?.getAttribute("type")).toBe("email");
    })
})