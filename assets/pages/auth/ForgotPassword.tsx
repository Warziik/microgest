import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "../../components/Button";
import TextInput from "../../components/form/TextInput";
import { useHistory } from "react-router";
import { forgotPassword } from "../../services/UserService";
import { useToast } from "../../hooks/useToast";

type FormData = {
    email: string;
}

export default function ForgotPassword() {
    const toast = useToast();
    const history = useHistory();

    useEffect(() => {
        document.title = "Mot de passe oublié - Microgest";
    }, [])

    const schema: yup.AnyObjectSchema = yup.object().shape({
        email:
            yup.string()
                .email("Le format de l'adresse email est invalide.")
                .required("Ce champ est requis.")
    });

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
        errors,
        setError,
        reset
    } = useForm<FormData>({ mode: "onTouched", resolver: yupResolver(schema) });

    const onSubmit = handleSubmit(async ({ email }) => {
        const [isSuccess, data] = await forgotPassword(email);

        if (isSuccess) {
            toast("success", "Un mail de réinitialisation de mot de passe vous a été envoyé.");
            reset();
        } else {
            if (Object.prototype.hasOwnProperty.call(data, "message")) {
                setError("email", {
                    type: "manual",
                    message: data.message
                });
            }
        }
    })

    return <div className="forgotPassword">
        <h1>Mot de passe oublié</h1>
        <div className="forgotPassword__content" onSubmit={onSubmit}>
            <Button className="btn--secondary" icon="arrow-left" onClick={() => history.push("/connexion")}>Retour à la connexion</Button>
            <p className="forgotPassword__description">Un mail contenant un lien de réinitialisation de mot de passe vous sera envoyé à l&apos;adresse email spécifiée ci-dessous si celle-ci est liée à un compte utilisateur existant.</p>
            <form className="form">
                <TextInput ref={register} error={errors.email} type="email" name="email" label="Adresse email" />
                <Button isLoading={isSubmitting} icon="send">Envoyer</Button>
            </form>
        </div>
    </div>
}