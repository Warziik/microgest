import React from 'react';
import {render, screen} from "@testing-library/react";
import { DatePickerInput } from '../../../components/form/DatePickerInput';

describe("DatePicker Input", () => {
    it("should render a date picker input", () => {
        render(<DatePickerInput error={undefined} name="datePicker" info="Secondary info" />);
        
        const datePicker: HTMLElement = screen.getByTestId("datePicker");
        const info: HTMLElement = screen.getByText("Secondary info");

        expect(datePicker).toBeInTheDocument();
        expect(datePicker).toHaveAttribute("type", "date");
        expect(datePicker).toHaveClass("form__input");

        expect(info).toBeInTheDocument();
        expect(info.tagName).toBe("P");
        expect(info).toHaveClass("form__info");
    });

    it("should render a date time picker input", () => {
        render(<DatePickerInput error={undefined} type="datetime-local" name="datePicker" info="Secondary info" />);
        
        const datePicker: HTMLElement = screen.getByTestId("datePicker");
        const info: HTMLElement = screen.getByText("Secondary info");

        expect(datePicker).toBeInTheDocument();
        expect(datePicker).toHaveAttribute("type", "datetime-local");
        expect(datePicker).toHaveClass("form__input");

        expect(info).toBeInTheDocument();
        expect(info.tagName).toBe("P");
        expect(info).toHaveClass("form__info");
    });

    it("should render a date picker input with label", () => {
        render(<DatePickerInput error={undefined} name="datePicker" label="Choose a date" />);
        
        const label: HTMLElement = screen.getByText("Choose a date");

        expect(label).toBeInTheDocument();
        expect(label.tagName).toBe("LABEL");
        expect(label).toHaveClass("form__label");
    });
});