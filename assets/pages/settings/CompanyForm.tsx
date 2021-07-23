import React from "react";
import { useAuth } from "../../hooks/useAuth";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "../../hooks/useToast";
import { useForm } from "react-hook-form";
import { Button } from "../../components/Button";
import { TextInput } from "../../components/form/TextInput";
import { updateUser } from "../../services/UserService";
import { ErrorResponse } from "../../types/ErrorResponse";
import { Violation } from "../../types/Violation";

type FormData = {
  businessName: string | null;
  siret: string;
  tvaNumber: string | null;
};

export function CompanyForm() {
  const { userData, setUserData } = useAuth();
  const toast = useToast();

  const schema: yup.AnyObjectSchema = yup.object().shape({
    businessName: yup
      .string()
      .nullable()
      .max(40, "Le nom de l'entreprise ne peut dépasser 40 caractères."),
    siret: yup
      .string()
      .matches(/^\d{14}$/, "Le numéro SIRET doit contenir 14 chiffres.")
      .required("Ce champ est requis."),
    tvaNumber: yup
      .string()
      .nullable()
      .max(13, "Le numéro de TVA ne peut dépasser 13 caractères."),
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
  } = useForm<FormData>({
    mode: "onTouched",
    resolver: yupResolver(schema),
    defaultValues: {
      businessName: userData.businessName,
      siret: userData.siret,
      tvaNumber: userData.tvaNumber,
    },
  });

  const onSubmit = handleSubmit(async (formData: FormData) => {
    if (formData.businessName === "") {
      formData.businessName = null;
    }
    if (formData.tvaNumber === "") {
      formData.tvaNumber = null;
    }

    const [isSuccess, data] = await updateUser(userData.id, formData);
    if (isSuccess) {
      setUserData({
        ...userData,
        businessName: data.businessName,
        siret: data.siret,
        tvaNumber: data.tvaNumber,
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

  return (
    <div className="settings__company">
      <form onSubmit={onSubmit}>
        <TextInput
          error={errors.businessName}
          label="Nom commercial (facultatif)"
          {...register("businessName")}
        />
        <TextInput
          error={errors.siret}
          label="Numéro SIRET"
          {...register("siret")}
        />
        <TextInput
          error={errors.tvaNumber}
          label="Numéro de TVA (facultatif)"
          {...register("tvaNumber")}
        />
        <Button isLoading={isSubmitting} htmlType="submit" center={true}>
          Mettre à jour
        </Button>
      </form>
    </div>
  );
}
