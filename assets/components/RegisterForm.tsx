import React, {useState} from 'react';
import { useForm } from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from './Button';
import PasswordInput from './form/PasswordInput';
import TextInput from './form/TextInput';
import { User } from '../types/User';
import { Violation } from '../types/Violation';

type Props = {
    createUser: ({firstname, lastname, email, password}: User) => Promise<[boolean, Record<string, unknown>]>;
}

type FormData = {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

const RegisterForm = ({createUser}: Props) => {
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
            .required("Ce champ est requis.")
    });

    const {
        register,
        handleSubmit,
        formState,
        errors,
        setError,
        reset
    } = useForm<FormData>({mode: "onTouched", resolver: yupResolver(schema)});

    const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);

    const onSubmit = handleSubmit(({firstname, lastname, email, password}) => {
        createUser({firstname, lastname, email, password})
            .then((value: [boolean, Record<string, unknown>]) => {
                const isSuccessfull: boolean = value[0];
                const responseData: User | any = value[1];
                if (isSuccessfull) {
                    setIsSubmittedSuccessfully(true);
                    reset();
                } else {
                    if (Object.prototype.hasOwnProperty.call(responseData, "violations")) {
                        responseData.violations.forEach((violation: Violation) => {
                            const invalidProperty: any = violation.propertyPath;
                            setError(invalidProperty, {
                                type: "manual",
                                message: violation.message
                            });
                        });
                    }
                }
            })

    })

    return <>
        {isSubmittedSuccessfully && <div className="alert--success">
            <p>Un mail de confirmation a été envoyé à l&apos;adresse email spécifiée.</p>
        </div>}
        <form className="form" onSubmit={onSubmit}>
            <div className="form__horizontal">
                <TextInput ref={register} error={errors.firstname} name="firstname" label="Prénom" />
                <TextInput ref={register} error={errors.lastname} name="lastname" label="Nom de famille" />
            </div>
            <TextInput ref={register} error={errors.email} type="email" name="email" label="Adresse email" />
            <PasswordInput ref={register} error={errors.password} name="password" label="Mot de passe" />
            <PasswordInput ref={register} error={errors.passwordConfirm} name="passwordConfirm" label="Confirmez votre mot de passe" />

            <Button disabled={formState.isSubmitting} icon="user-plus">Créer mon compte</Button>
        </form>
    </>;
}

export default RegisterForm;