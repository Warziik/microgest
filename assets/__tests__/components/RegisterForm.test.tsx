import React from 'react';
import {render, screen, fireEvent, act} from "@testing-library/react";
import RegisterForm from '../../components/RegisterForm';

describe("Registration form", () => {
    const mockCreateUser = jest.fn().mockResolvedValue([true, {}]);

    beforeEach(() => {
        render(<RegisterForm createUser={mockCreateUser} />);
    })

    it("should display input errors", async () => {
        await act(async () => {
            fireEvent.submit(screen.getByTestId("button"));
        })        

        expect(await screen.findAllByRole("alert")).toHaveLength(5);
        expect(mockCreateUser).not.toHaveBeenCalled();
    })

     it("should submit the form without errors", async () => {
        const firstnameInput: HTMLInputElement | any = screen.getByLabelText("Prénom");
        const lastnameInput: HTMLInputElement | any = screen.getByLabelText("Nom de famille");
        const emailInput: HTMLInputElement | any = screen.getByLabelText("Adresse email");
        const passwordInput: HTMLInputElement | any = screen.getByLabelText("Mot de passe");
        const confirmPasswordInput: HTMLInputElement | any = screen.getByLabelText("Confirmez votre mot de passe");

        await act(async () => {
            fireEvent.input(firstnameInput, {target: {value: "Alex"}});
            fireEvent.input(lastnameInput, {target: {value: "Lastname"}});
            fireEvent.input(emailInput, {target: {value: "demoUser@localhost.dev"}});
            fireEvent.input(passwordInput, {target: {value: "demo1234"}});
            fireEvent.input(confirmPasswordInput, {target: {value: "demo1234"}});        
        });

        await act(async () => {
            fireEvent.submit(screen.getByTestId("button"));
        })

        expect(screen.queryAllByRole("alert")).toHaveLength(0);
        expect(mockCreateUser).toHaveBeenCalledTimes(1);
        expect(mockCreateUser).toHaveBeenCalledWith({
            firstname: "Alex",
            lastname: "Lastname",
            email: "demoUser@localhost.dev",
            password: "demo1234"
        });
        expect(firstnameInput.value).toBe("");
        expect(lastnameInput.value).toBe("");
        expect(emailInput.value).toBe("");
        expect(passwordInput.value).toBe("");
        expect(confirmPasswordInput.value).toBe("");
    })
})