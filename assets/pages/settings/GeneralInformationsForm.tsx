import React from "react";
import { Button } from "../../components/Button";
import { useAuth } from "../../hooks/useAuth";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TextInput from "../../components/form/TextInput";
import { updateUser } from "../../services/UserService";
import { useToast } from "../../hooks/useToast";
import { Violation } from "../../types/Violation";
import { User } from "../../types/User";
import { ErrorResponse } from "../../types/ErrorResponse";

type FormData = {
    firstname: string;
    lastname: string;
}

function isErrorResponse(response: ErrorResponse | User): response is ErrorResponse {
    return (response as ErrorResponse).violations !== undefined;
}

export function GeneralInformationsForm() {
    const { userData, setUserData } = useAuth();
    const toast = useToast();
    const schema: yup.AnyObjectSchema = yup.object().shape({
        firstname:
            yup.string()
                .min(3, "Le prénom doit contenir au minimum 3 caractères.")
                .max(30, "Le prénom ne peut dépasser 30 caractères.")
                .required("Ce champ est requis."),
        lastname:
            yup.string()
                .min(3, "Le nom de famille doit contenir au minimum 3 caractères.")
                .max(30, "Le nom de famille ne peut dépasser 30 caractères.")
                .required("Ce champ est requis."),
    });

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
        errors,
        setError
    } = useForm<FormData>({
        mode: "onTouched", resolver: yupResolver(schema), defaultValues: {
            firstname: userData.firstname,
            lastname: userData.lastname
        }
    });

    const onSubmit = handleSubmit(async ({ firstname, lastname }) => {
        const [isSuccess, data] = await updateUser(userData.id, { firstname, lastname });
        if (isSuccess && !isErrorResponse(data)) {
            setUserData(data);
            toast("success", "Votre profil a bien été mise à jour.");
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

    return <>
        <div className="settings__generalInformations-picture">
            <img src="https://via.placeholder.com/144" alt="Your profile picture." />
            <p>Vous pouvez changer votre photo de profil en cliquant sur le bouton ci-dessous.</p>
            <Button className="btn--secondary" icon="edit">Changer</Button>
        </div>
        <hr />
        <form className="settings__generalInformations-form" onSubmit={onSubmit}>
            <TextInput
                ref={register}
                error={errors.firstname}
                type="text"
                name="firstname"
                label="Prénom"
            />
            <TextInput
                ref={register}
                error={errors.lastname}
                type="text"
                name="lastname"
                label="Nom de famille"
            />
            <Button isLoading={isSubmitting}>Sauvegarder</Button>
        </form>
    </>
}