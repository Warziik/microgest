import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../components/Button";
import PasswordInput from "../../components/form/PasswordInput";
import TextInput from "../../components/form/TextInput";
import { useHistory } from "react-router";
import { Violation } from "../../types/Violation";
import { Link } from "react-router-dom";

type Props = {
    login: (email: string, password: string) => Promise<[boolean, Record<string, any | Violation>]>;
}

type FormData = {
    email: string;
    password: string;
}

export default function LoginForm({ login }: Props) {
    const history = useHistory();

    const schema: yup.AnyObjectSchema = yup.object().shape({
        email:
            yup.string()
                .email("Le format de l'adresse email est invalide.")
                .required("Ce champ est requis."),
        password:
            yup.string()
                .required("Ce champ est requis.")
    });

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
        errors,
        reset
    } = useForm<FormData>({ mode: "onTouched", resolver: yupResolver(schema) });

    const [customAlert, setCustomAlert] = useState<{ type: "error" | "warning", message: string } | null>();

    const onSubmit = handleSubmit(async ({ email, password }) => {
        const [isSuccess, data] = await login(email, password);
        if (isSuccess) {
            console.log("Vous êtes connecté.", data.token);
            setCustomAlert(null);
            reset();

            // TODO: Notify the User that he is logged
            history.push("/"); // Redirect to dashboard
        } else {
            if (Object.prototype.hasOwnProperty.call(data, "message")) {
                if (data.code === 401) {
                    setCustomAlert({ type: "error", message: data.message }); // Invalid credentials.
                } else {
                    setCustomAlert({ type: "warning", message: data.message }); // Unconfirmed account.
                    reset();
                }
            } else {
                setCustomAlert({ type: "error", message: "Une erreur inattendue s'est produite, veuillez réessayer plus tard." });
            }
        }
    })

    return <>
        {customAlert && <div data-testid="alert-server" className={`alert--${customAlert.type}`}>
            <p>{customAlert.message}</p>
        </div>}

        <form className="form" onSubmit={onSubmit}>
            <TextInput ref={register} error={errors.email} type="email" name="email" label="Adresse email" />
            <PasswordInput ref={register} error={errors.password} name="password" label="Mot de passe" />
            <Link to="/mot-de-passe-oublie">Mot de passe oublié</Link>
            <Button isDisabled={isSubmitting} icon="unlock">Se connecter</Button>
        </form>
    </>
}