import React from 'react';
import {render, screen} from "@testing-library/react";
import {ToggleInput} from '../../../components/form/ToggleInput';

describe("Toggle Input", () => {
    it("should render a switch input", () => {
        render(<ToggleInput type="switch" label="Demo switch" name="switch" />);
        
        const checkbox: HTMLElement = screen.getByRole("checkbox");
        const label: HTMLElement = screen.getByText("Demo switch");

        expect(checkbox).toBeInTheDocument();
        expect(checkbox.tagName).toBe("INPUT");
        expect(checkbox).toHaveAttribute("name", "switch");

        expect(label).toBeInTheDocument();
        expect(label.tagName).toBe("P");
        expect(label).toHaveClass("form__label");
    });

    it("should render a checkbox input", () => {
        render(<ToggleInput type="checkbox" label="Demo checkbox" name="checkbox" />);

        const checkbox: HTMLElement = screen.getByRole("checkbox");
        const label: HTMLElement = screen.getByText("Demo checkbox");

        expect(checkbox).toBeInTheDocument();
        expect(checkbox.tagName).toBe("INPUT");
        expect(checkbox).toHaveAttribute("name", "checkbox");

        expect(label).toBeInTheDocument();
        expect(label.tagName).toBe("LABEL");
        expect(label).toHaveClass("form__label");
    });
});