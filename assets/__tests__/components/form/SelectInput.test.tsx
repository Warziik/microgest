import React from "react";
import { render, screen } from "@testing-library/react";
import { Option, SelectInput } from "../../../components/form/SelectInput";

describe("Select Input", () => {
    beforeEach(() => {
        const options: Option[] = [
            {label: "Option 1", value: "1"},
            {label: "Option 2", value: "2"}
        ];
        render(<SelectInput error={undefined} options={options} name="test" label="Test label" />)
    });

    it("should render a select input", () => {
        const selectInput: HTMLElement = screen.getByRole("combobox");
        const options: HTMLElement[] = screen.getAllByRole("option");

        expect(selectInput).toBeInTheDocument();
        expect(selectInput.tagName).toBe("SELECT");
        expect(selectInput).toHaveAttribute("name", "test");
        expect(options).toHaveLength(2);
    });

    it("should render a select input with a label", () => {
        const selectInput: HTMLElement = screen.getByRole("combobox");
        const label: HTMLElement = screen.getByText("Test label");

        expect(selectInput).toBeInTheDocument();
        expect(label).toBeInTheDocument();
        expect(label.tagName).toBe("LABEL");
    });
});