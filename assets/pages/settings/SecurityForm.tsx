import React from "react";
import { useToast } from "../../hooks/useToast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { updateUser } from "../../services/UserService";
import { Violation } from "../../types/Violation";
import { useAuth } from "../../hooks/useAuth";
import PasswordInput from "../../components/form/PasswordInput";
import { Button } from "../../components/Button";
import { ErrorResponse } from "../../types/ErrorResponse";
import { User } from "../../types/User";

type FormData = {
    password: string;
    passwordConfirm: string;
}

function isErrorResponse(response: ErrorResponse | User): response is ErrorResponse {
    return (response as ErrorResponse).violations !== undefined;
}

export function SecurityForm() {
    const { userData } = useAuth();
    const toast = useToast();

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
        errors,
        setError
    } = useForm<FormData>({
        mode: "onTouched", resolver: yupResolver(schema)
    });

    const onSubmit = handleSubmit(async ({ password }) => {
        const [isSuccess, data] = await updateUser(userData.id, { password });
        if (isSuccess) {
            toast("success", "Votre mot de passe a bien été mis à jour.");
        } else {
            if (isErrorResponse(data)) {
                data.violations?.forEach((violation: Violation) => {
                    const invalidProperty: any = violation.propertyPath;
                    setError(invalidProperty, {
                        type: "manual",
                        message: violation.message
                    });
                });
            }
        }
    })

    return <form className="settings__security" onSubmit={onSubmit}>
        <PasswordInput ref={register} error={errors.password} name="password" label="Nouveau mot de passe" />
        <PasswordInput ref={register} error={errors.passwordConfirm} name="passwordConfirm"
            label="Confirmez votre nouveau mot de passe"
        />
        <Button isLoading={isSubmitting}>Sauvegarder</Button>
    </form>
}