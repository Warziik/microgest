import React from "react";
import {render, screen} from "@testing-library/react";
import {Option, SelectInput} from "../../../components/form/SelectInput";

describe("Select Input", () => {
    beforeEach(() => {
        const options: Option[] = [
            {label: "Option 1", value: "1"},
            {label: "Option 2", value: "2"}
        ];
        render(<SelectInput options={options} name="test" label="Test label" info="Info message"/>)
    });

    it("should render a select input with a label", () => {
        const label: HTMLElement = screen.getByText("Test label");

        expect(label).toBeInTheDocument();
        expect(label.tagName).toBe("LABEL");
    });

    it("should render a select input with a info message", () => {
        const infoMsg: HTMLElement = screen.getByText("Info message");

        expect(infoMsg).toBeInTheDocument();
        expect(infoMsg.tagName).toBe("P");
    });
});