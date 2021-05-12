import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '../../components/Button';
import { PasswordInput } from '../../components/form/PasswordInput';
import { TextInput } from '../../components/form/TextInput';
import { Violation } from '../../types/Violation';
import { useToast } from '../../hooks/useToast';
import { SignupData } from '../../types/User';
import { Option, SelectInput } from '../../components/form/SelectInput';

type Props = {
    createUser: (data: SignupData) => Promise<[boolean, Record<string, any | Violation>]>;
}

type FormData = {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    passwordConfirm: string;
    phone: string | null;
    businessName: string | null;
    siret: string;
    tvaNumber: string | null;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

export function RegisterForm({ createUser }: Props) {
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
        email:
            yup.string()
                .email("Le format de l'adresse email est invalide.")
                .required("Ce champ est requis."),
        password:
            yup.string()
                .min(3, "Le mot de passe doit contenir au minimum 3 caractères.")
                .max(255, "Le mot de passe ne peut dépasser 255 caractères.")
                .required("Ce champ est requis."),
        passwordConfirm:
            yup.string()
                .oneOf([yup.ref("password"), null], "Les mots de passe ne correspondent pas.")
                .required("Ce champ est requis."),
        phone:
            yup.string()
                .max(255),
        businessName:
            yup.string()
                .max(40, "Le nom de l'entreprise ne peut dépasser 40 caractères."),
        siret:
            yup.string()
                .matches(/^\d{14}$/, "Le numéro SIRET doit contenir 14 chiffres.")
                .required("Ce champ est requis."),
        tvaNumber:
            yup.string()
                .max(13, "Le numéro de TVA ne peut dépasser 13 caractères."),
        address:
            yup.string()
                .max(255)
                .required("Ce champ est requis."),
        city:
            yup.string()
                .max(255)
                .required("Ce champ est requis."),
        postalCode:
            yup.string()
                .matches(/^\d{5}$/, "Le code postal doit contenir 5 chiffres.")
                .required("Ce champ est requis."),
        country:
            yup.string()
                .required("Ce champ est requis."),
    });

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
        setError,
        reset
    } = useForm<FormData>({ mode: "onTouched", resolver: yupResolver(schema) });

    const selectCountryOptions: Option[] = [
        {value: "FRA", label: "France"}
    ];

    const onSubmit = handleSubmit(async (formData: FormData) => {
        if (formData.phone === "") {
            formData.phone = null;
        }
        
        if (formData.businessName === "") {
            formData.businessName = null;
        }

        if (formData.tvaNumber === "") {
            formData.tvaNumber = null;
        }

        const [isSuccess, data] = await createUser({...formData, postalCode: parseInt(formData.postalCode)});

        if (isSuccess) {
            toast("success", "Un mail de confirmation a été envoyé à l'adresse email spécifiée.");
            reset();
        } else {
            if (Object.prototype.hasOwnProperty.call(data, "violations")) {
                data.violations.forEach((violation: Violation) => {
                    const invalidProperty: any = violation.propertyPath;
                    setError(invalidProperty, {
                        type: "manual",
                        message: violation.message
                    });
                });
            }
        }
    });

    return <form className="form registerForm" onSubmit={onSubmit}>
        <div className="form__horizontal">
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

        <TextInput
            error={errors.email}
            type="email"
            label="Adresse email"
            {...register("email")}
        />

        <PasswordInput
            error={errors.password}
            label="Mot de passe"
            {...register("password")}
        />

        <PasswordInput
            error={errors.passwordConfirm}
            label="Confirmez votre mot de passe"
            {...register("passwordConfirm")}
        />

        <TextInput
            error={errors.phone}
            label="Numéro de téléphone (facultatif)"
            {...register("phone")}
        />

        <TextInput
            error={errors.businessName}
            label="Nom commercial (facultatif)"
            {...register("businessName")}
        />

        <TextInput
            error={errors.siret}
            type="number"
            label="Numéro SIRET"
            {...register("siret")}
        />

        <TextInput
            error={errors.tvaNumber}
            label="Numéro de TVA (facultatif)"
            {...register("tvaNumber")}
        />

        <TextInput
            error={errors.address}
            label="Adresse"
            {...register("address")}
        />

        <TextInput
            error={errors.city}
            label="Ville"
            {...register("city")}
        />

        <TextInput
            error={errors.postalCode}
            type="number"
            label="Code postal"
            {...register("postalCode")}
        />
        
        <SelectInput
            error={errors.country}
            options={selectCountryOptions}
            label="Pays"
            {...register("country")}
        />

        <Button isLoading={isSubmitting} icon="user-plus">Créer mon compte</Button>
    </form>;
}