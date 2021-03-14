import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../components/Button";
import TextInput from "../../components/form/TextInput";
import { useHistory } from "react-router";
import { forgotPassword } from "../../services/UserService";

type FormData = {
    email: string;
}

export default function ForgotPassword() {
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
        formState: { isSubmitting, isSubmitSuccessful },
        errors,
        setError,
        reset
    } = useForm<FormData>({ mode: "onTouched", resolver: yupResolver(schema) });

    const onSubmit = handleSubmit(async ({ email }) => {
        const [isSuccess, data] = await forgotPassword(email);

        if (isSuccess) {
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
            <p className="forgotPassword__description">Un email contenant un lien de réinitialisation de mot de passe sera envoyée à l&apos;adresse email renseignée ci-dessous si celle-ci est liée à un compte utilisateur.</p>
            {isSubmitSuccessful && <div className="alert--success">Un mail pour réinitialiser votre mot de passe vous a été envoyé.</div>}
            <form className="form">
                <TextInput ref={register} error={errors.email} type="email" name="email" label="Adresse email" />
                <Button isDisabled={isSubmitting} icon="send">Envoyer</Button>
            </form>
        </div>
    </div>
}