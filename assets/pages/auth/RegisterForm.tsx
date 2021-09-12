import React from "react";
import {Stepper} from "../../components/stepper/Stepper";
import {Step} from "../../components/stepper/Step";
import {useState} from "react";
import {Icon} from "../../components/Icon";
import {PersonalStep} from "./register/PersonalStep";
import {AddressStep} from "./register/AddressStep";
import {CompanyStep} from "./register/CompanyStep";
import {FormProvider, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {signup} from "../../services/UserService";
import {useToast} from "../../hooks/useToast";
import {Violation} from "../../types/Violation";
import {Option} from "../../components/form/SelectInput";

type FormData = {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    passwordConfirm: string;
    phone: string | null;
    address: string;
    city: string;
    postalCode: string;
    country: Option;
    businessName: string | null;
    siret: string;
    tvaNumber: string | null;
};

export function RegisterForm() {
    const toast = useToast();
    const [isComplete, setIsComplete] = useState(false);

    const schema: yup.AnyObjectSchema = yup.object().shape({
        firstname: yup
            .string()
            .min(3, "Le prénom doit contenir au minimum 3 caractères.")
            .max(30, "Le prénom ne peut dépasser 30 caractères.")
            .required("Ce champ est requis."),
        lastname: yup
            .string()
            .min(3, "Le nom de famille doit contenir au minimum 3 caractères.")
            .max(30, "Le nom de famille ne peut dépasser 30 caractères.")
            .required("Ce champ est requis."),
        email: yup
            .string()
            .email("Le format de l'adresse email est invalide.")
            .required("Ce champ est requis."),
        password: yup
            .string()
            .min(3, "Le mot de passe doit contenir au minimum 3 caractères.")
            .max(255, "Le mot de passe ne peut dépasser 255 caractères.")
            .required("Ce champ est requis."),
        passwordConfirm: yup
            .string()
            .oneOf(
                [yup.ref("password"), null],
                "Les mots de passe ne correspondent pas."
            )
            .required("Ce champ est requis."),
        phone: yup.string().max(255),
        address: yup.string().max(255).required("Ce champ est requis."),
        city: yup.string().max(255).required("Ce champ est requis."),
        postalCode: yup
            .string()
            .matches(/^\d{5}$/, "Le code postal doit contenir 5 chiffres.")
            .required("Ce champ est requis."),
        country: yup.object().required("Ce champ est requis."),
        businessName: yup
            .string()
            .max(40, "Le nom de l'entreprise ne peut dépasser 40 caractères."),
        siret: yup
            .string()
            .matches(/^\d{14}$/, "Le numéro SIRET doit contenir 14 chiffres.")
            .required("Ce champ est requis."),
        tvaNumber: yup
            .string()
            .max(13, "Le numéro de TVA ne peut dépasser 13 caractères."),
    });

    const methods = useForm<FormData>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const onSubmit = methods.handleSubmit(async (formData: FormData) => {
        if (formData.phone === "") {
            formData.phone = null;
        }
        if (formData.businessName === "") {
            formData.businessName = null;
        }
        if (formData.tvaNumber === "") {
            formData.tvaNumber = null;
        }

        const [isSuccess, data] = await signup({
            ...formData,
            country: formData.country.value as string,
            postalCode: parseInt(formData.postalCode),
        });

        if (isSuccess) {
            setIsComplete(true);
        } else {
            if (Object.prototype.hasOwnProperty.call(data, "violations")) {
                data.violations.forEach((violation: Violation) => {
                    const invalidProperty: any = violation.propertyPath;
                    methods.setError(invalidProperty, {
                        type: "manual",
                        message: violation.message,
                    });
                });
                toast("error", "Veuillez corriger les erreurs dans le formulaire.");
            }
        }
    });

    return (
        (isComplete && (
            <div className="auth__completeMessage">
                <div className="auth__completeMessage-check">
                    <Icon name="check"/>
                </div>
                <h2>Votre compte a bien été crée !</h2>
                <p>
                    Un email contenant un lien de confirmation de compte vous a été envoyé
                    à l’adresse email renseignée dans le formulaire.
                </p>
            </div>
        )) || (
            <FormProvider {...methods}>
                <form onSubmit={onSubmit}>
                    <Stepper>
                        <Step name="Personnelle">
                            <PersonalStep/>
                        </Step>
                        <Step name="Adresse">
                            <AddressStep/>
                        </Step>
                        <Step name="Entreprise">
                            <CompanyStep/>
                        </Step>
                    </Stepper>
                </form>
            </FormProvider>
        )
    );
}
