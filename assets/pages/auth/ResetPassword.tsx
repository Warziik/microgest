import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../components/Button";
import PasswordInput from "../../components/form/PasswordInput";
import { resetPassword } from "../../services/UserService";

type MatchParams = {
    token: string;
}

type FormData = {
    password: string;
    passwordConfirm: string;
}

export default function ResetPassword() {
    const { token } = useParams<MatchParams>();
    const history = useHistory();
    const [customError, setCustomError] = useState<string>();

    const schema: yup.AnyObjectSchema = yup.object().shape({
        password:
            yup.string()
                .min(3, "Le mot de passe doit contenir au minimum 3 caractères.")
                .max(255, "Le mot de passe ne peut dépasser 255 caractères.")
                .required("Ce champ est requis."),
        passwordConfirm:
            yup.string()
                .oneOf([yup.ref("password"), null], "Les mots de passe ne correspondent pas.")
                .required("Ce champ est requis.")
    });

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
        errors
    } = useForm<FormData>({ mode: "onTouched", resolver: yupResolver(schema) });

    const onSubmit = handleSubmit(async ({ password }) => {
        const [isSuccess, data] = await resetPassword(password, token);

        if (isSuccess) {
            console.log("Votre mot de passe a bien été mis à jour.");
            history.push("/");
        } else {
            if (Object.prototype.hasOwnProperty.call(data, "message")) {
                setCustomError(data.message);
            } else {
                setCustomError("Une erreur inattendue s'est produite, veuillez réessayer plus tard.");
            }
        }
    })

    return <div className="resetPassword">
        <h1>Réinitialisation de votre mot de passe</h1>
        <div className="resetPassword__content">
            {customError && <div className="alert--error">{customError}</div>}
            <form className="form" onSubmit={onSubmit}>
                <PasswordInput ref={register} error={errors.password} name="password" label="Nouveau mot de passe" />
                <PasswordInput ref={register} error={errors.passwordConfirm} name="passwordConfirm" label="Confirmez votre nouveau mot de passe" />

                <Button isDisabled={isSubmitting}>Sauvegarder</Button>
            </form>
        </div>
    </div>
}