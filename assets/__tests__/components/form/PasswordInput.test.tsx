import React from 'react';
import {render, fireEvent, act} from "@testing-library/react";
import PasswordInput from '../../../components/form/PasswordInput';

describe("Password input", () => {
    it("should render a password input", () => {
        render(<PasswordInput name="password" error={undefined} />);

        const input: HTMLInputElement | null = document.querySelector("input.form__input");

        expect(input).toBeInTheDocument();
        expect(input?.getAttribute("type")).toBe("password");
    })

    it("should render a password input with a label", () => {
        render(<PasswordInput name="password" label="Mot de passe" error={undefined} />);

        const label: Element | null = document.querySelector("label.form__label");

        expect(label).toBeInTheDocument();
        expect(label?.textContent).toBe("Mot de passe");
    })

    it("should toggle password visibility", async () => {
        render(<PasswordInput name="password" error={undefined} />);

        const input: HTMLInputElement | null = document.querySelector("input.form__input");
        const actionBtn: Element | any = document.querySelector("button");

        await act(async () => {
            fireEvent.click(actionBtn);
        });

        expect(input).toBeInTheDocument();
        expect(actionBtn).toBeInTheDocument();
        expect(input?.getAttribute("type")).toBe("text");
    })
})