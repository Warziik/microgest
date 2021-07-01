import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "../../components/Button";
import { TextInput } from "../../components/form/TextInput";
import { useHistory } from "react-router";
import { forgotPassword } from "../../services/UserService";
import { useToast } from "../../hooks/useToast";
import { Icon } from "../../components/Icon";

type FormData = {
  email: string;
};

export function ForgotPasswordForm() {
  const [isComplete, setIsComplete] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const schema: yup.AnyObjectSchema = yup.object().shape({
    email: yup
      .string()
      .email("Le format de l'adresse email est invalide.")
      .required("Ce champ est requis."),
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<FormData>({ mode: "onTouched", resolver: yupResolver(schema) });

  const onSubmit = handleSubmit(async ({ email }) => {
    const [isSuccess, data] = await forgotPassword(email);

    if (isSuccess) {
      reset();
      setIsComplete(true);
    } else {
      if (Object.prototype.hasOwnProperty.call(data, "message")) {
        toast("error", data.message);
      }
    }
  });

  return (
    (isComplete && (
      <div className="auth__completeMessage">
        <div className="auth__completeMessage-check">
          <Icon name="check" />
        </div>
        <h2>Un email vous a été envoyé</h2>
        <p>
          Un email contenant un lien de réinitialisation de mot de passe vous a
          été envoyé à l’adresse email renseignée précédemment.
        </p>
      </div>
    )) || (
      <>
        <Button
          type="outline"
          icon="arrow-left"
          onClick={() => history.push("/connexion")}
        >
          Retour à la connexion
        </Button>
        <p className="forgotPassword__description">
          Un mail contenant un lien de réinitialisation de mot de passe vous
          sera envoyé à l&apos;adresse email spécifiée ci-dessous si celle-ci
          est liée à un compte utilisateur existant.
        </p>
        <form className="form" onSubmit={onSubmit}>
          <TextInput
            error={errors.email}
            type="email"
            label="Adresse email"
            {...register("email")}
          />
          <Button
            isLoading={isSubmitting}
            center={true}
            icon="send"
            htmlType="submit"
          >
            Envoyer
          </Button>
        </form>
      </>
    )
  );
}
