import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "../../components/Button";
import { PasswordInput } from "../../components/form/PasswordInput";
import { TextInput } from "../../components/form/TextInput";
import { useHistory } from "react-router";
import { Violation } from "../../types/Violation";
import { Link } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { Icon } from "../../components/Icon";

type Props = {
  login: (
    email: string,
    password: string
  ) => Promise<[boolean, Record<string, any | Violation>]>;
};

type FormData = {
  emailLogin: string;
  passwordLogin: string;
};

export function LoginForm({ login }: Props) {
  const toast = useToast();
  const history = useHistory();

  const schema: yup.AnyObjectSchema = yup.object().shape({
    emailLogin: yup
      .string()
      .email("Le format de l'adresse email est invalide.")
      .required("Ce champ est requis."),
    passwordLogin: yup.string().required("Ce champ est requis."),
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<FormData>({ mode: "onTouched", resolver: yupResolver(schema) });

  const onSubmit = handleSubmit(async ({ emailLogin, passwordLogin }) => {
    const [isSuccess, data] = await login(emailLogin, passwordLogin);
    if (isSuccess) {
      toast("success", "Vous êtes connecté.");
      reset();
      history.push("/"); // Redirect to dashboard
    } else {
      if (Object.prototype.hasOwnProperty.call(data, "message")) {
        if (data.code === 401) {
          toast("error", data.message);
        } else {
          toast("warning", data.message);
          reset();
        }
      } else {
        toast(
          "error",
          "Une erreur inattendue s'est produite, veuillez réessayer plus tard."
        );
      }
    }
  });

  return (
    <form className="form loginForm" onSubmit={onSubmit}>
      <TextInput
        error={errors.emailLogin}
        type="email"
        label="Adresse email"
        {...register("emailLogin")}
      />

      <PasswordInput
        error={errors.passwordLogin}
        label="Mot de passe"
        {...register("passwordLogin")}
      />

      <Link className="link" to="/mot-de-passe-oublié">
        Mot de passe oublié
        <Icon name="arrow-left" />
      </Link>

      <Button
        isLoading={isSubmitting}
        icon="unlock"
        htmlType="submit"
        center={true}
      >
        Se connecter
      </Button>
    </form>
  );
}
