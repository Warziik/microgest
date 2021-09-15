import React from 'react';
import {render, screen} from "@testing-library/react";
import {DatePickerInput} from '../../../components/form/DatePickerInput';

describe("DatePicker Input", () => {
    const onChange = jest.fn();

    it("should render a date picker input", () => {
        render(<DatePickerInput
            name="datePicker"
            info="Secondary info"
            onChange={onChange}
            value=""
        />);

        const datePicker: HTMLElement = screen.getByTestId("datePicker");
        const info: HTMLElement = screen.getByText("Secondary info");

        expect(datePicker).toBeInTheDocument();
        expect(datePicker).toHaveAttribute("type", "date");

        expect(info).toBeInTheDocument();
        expect(info.tagName).toBe("P");
        expect(info).toHaveClass("form__info");
    });

    it("should render a date picker input with label", () => {
        render(<DatePickerInput
            name="datePicker"
            label="Choose a date"
            onChange={onChange}
            value=""
        />);
        const label: HTMLElement = screen.getByText("Choose a date");

        expect(label).toBeInTheDocument();
        expect(label.tagName).toBe("LABEL");
        expect(label).toHaveClass("form__label");
    });
});