import React from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "../../components/Button";
import { PasswordInput } from "../../components/form/PasswordInput";
import { resetPassword } from "../../services/UserService";
import { useToast } from "../../hooks/useToast";

type MatchParams = {
  token: string;
};

type FormData = {
  password: string;
  passwordConfirm: string;
};

export function ResetPassword() {
  const { token } = useParams<MatchParams>();
  const toast = useToast();
  const history = useHistory();

  const schema: yup.AnyObjectSchema = yup.object().shape({
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
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({ mode: "onTouched", resolver: yupResolver(schema) });

  const onSubmit = handleSubmit(async ({ password }) => {
    const [isSuccess, data] = await resetPassword(password, token);

    if (isSuccess) {
      toast("success", "Votre mot de passe a bien été mis à jour.");
      history.push("/");
    } else {
      if (Object.prototype.hasOwnProperty.call(data, "message")) {
        toast("error", data.message);
      } else {
        toast(
          "error",
          "Une erreur inattendue s&apos;est produite, veuillez réessayer plus tard."
        );
      }
    }
  });

  return (
    <div className="resetPassword">
      <h1>Réinitialisation de votre mot de passe</h1>
      <div className="resetPassword__content">
        <form className="form" onSubmit={onSubmit}>
          <PasswordInput
            error={errors.password}
            label="Nouveau mot de passe"
            {...register("password")}
          />

          <PasswordInput
            error={errors.passwordConfirm}
            label="Confirmez votre nouveau mot de passe"
            {...register("passwordConfirm")}
          />

          <Button isLoading={isSubmitting} htmlType="submit" center={true}>
            Mettre à jour
          </Button>
        </form>
      </div>
    </div>
  );
}
