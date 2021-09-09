import React, {useEffect, useState} from "react";
import {Button} from "../../components/Button";
import {useAuth} from "../../hooks/useAuth";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {TextInput} from "../../components/form/TextInput";
import {updateUser} from "../../services/UserService";
import {useToast} from "../../hooks/useToast";
import {Violation} from "../../types/Violation";
import {ErrorResponse} from "../../types/ErrorResponse";
import {getNames as getCountries, alpha2ToAlpha3} from "i18n-iso-countries";
import {Option, SelectInput} from "../../components/form/SelectInput";

type FormData = {
    firstname: string;
    lastname: string;
    email: string;
    phone: string | null;
    address: string;
    city: string;
    postalCode: string;
    country: string;
};

export function PersonalInformationsForm() {
    const {userData, setUserData} = useAuth();
    const toast = useToast();

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
        phone: yup.string().max(255),
        address: yup.string().max(255).required("Ce champ est requis."),
        city: yup.string().max(255).required("Ce champ est requis."),
        postalCode: yup
            .string()
            .matches(/^\d{5}$/, "Le code postal doit contenir 5 chiffres.")
            .required("Ce champ est requis."),
        country: yup.string().required("Ce champ est requis."),
    });

    const [selectCountryOptions, setSelectCountryOptions] = useState<Option[]>([]);

    const {
        register,
        handleSubmit,
        formState: {isSubmitting, errors},
        setError,
        setValue
    } = useForm<FormData>({
        mode: "onTouched",
        resolver: yupResolver(schema),
        defaultValues: {
            firstname: userData.firstname,
            lastname: userData.lastname,
            email: userData.email,
            phone: userData.phone ?? "",
            address: userData.address,
            city: userData.city,
            postalCode: userData.postalCode.toString(),
            country: "",
        },
    });

    const onSubmit = handleSubmit(async (formData: FormData) => {
        if (formData.phone === "") {
            formData.phone = null;
        }
        const [isSuccess, data] = await updateUser(userData.id, {
            ...formData,
            postalCode: parseInt(formData.postalCode),
        });
        if (isSuccess) {
            setUserData({
                ...userData,
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                phone: data.phone,
                address: data.address,
                city: data.city,
                postalCode: data.postalCode,
                country: data.country,
            });
            toast("success", "Votre compte a bien été mis à jour.");
        } else {
            if (Object.prototype.hasOwnProperty.call(data, "violations")) {
                const response = data as ErrorResponse;
                response.violations?.forEach((violation: Violation) => {
                    setError(violation.propertyPath as keyof FormData, {
                        type: "manual",
                        message: violation.message,
                    });
                });
            } else {
                toast(
                    "error",
                    "Une erreur inattendue s'est produite, veuillez réessayer plus tard."
                );
            }
        }
    });

    useEffect(() => {
        const options: Option[] = [];
        for (const [key, value] of Object.entries(getCountries("fr", {select: "official"}))) {
            options.push({value: alpha2ToAlpha3(key), label: value});
        }
        setSelectCountryOptions(options);
    }, []);

    useEffect(() => {
        setValue("country", userData.country);
    }, [selectCountryOptions]);

    return (
        <div className="settings__personalInformations">
            <form className="settings__personalInformations-form" onSubmit={onSubmit}>
                <div className="settings__personalInformations-nameForm">
                    <TextInput
                        error={errors.firstname}
                        label="Prénom"
                        {...register("firstname")}
                    />

                    <TextInput
                        error={errors.lastname}
                        label="Nom de famille"
                        {...register("lastname")}
                    />
                </div>

                <div className="settings__personalInformations-contactForm">
                    <h3>Contact</h3>
                    <TextInput
                        error={errors.email}
                        type="email"
                        label="Adresse email"
                        {...register("email")}
                    />
                    <TextInput
                        error={errors.phone}
                        label="Numéro de téléphone"
                        {...register("phone")}
                    />
                </div>

                <div className="settings__personalInformations-addressForm">
                    <h3>Adresse</h3>
                    <SelectInput
                        error={errors.country}
                        label="Pays"
                        options={selectCountryOptions}
                        {...register("country")}
                    />
                    <div className="settings__personalInformations-addressForm-city">
                        <TextInput
                            error={errors.city}
                            label="Ville"
                            {...register("city")}
                        />
                        <TextInput
                            error={errors.postalCode}
                            label="Code postal"
                            {...register("postalCode")}
                        />
                    </div>
                    <TextInput
                        error={errors.address}
                        label="Adresse"
                        {...register("address")}
                    />
                </div>

                <Button isLoading={isSubmitting} htmlType="submit" center={true}>
                    Mettre à jour
                </Button>
            </form>
        </div>
    );
}
