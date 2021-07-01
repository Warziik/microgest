import React from "react";
import { Button } from "../../components/Button";
import { useAuth } from "../../hooks/useAuth";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextInput } from "../../components/form/TextInput";
import { updateUser } from "../../services/UserService";
import { useToast } from "../../hooks/useToast";
import { Violation } from "../../types/Violation";
import { User } from "../../types/User";
import { ErrorResponse } from "../../types/ErrorResponse";

type FormData = {
  firstname: string;
  lastname: string;
  /*   email: string;
  phone: string;
  businessName: string;
  siret: string;
  tvaNumber: string;
  address: string;
  city: string;
  postalCode: string;
  country: string; */
};

function isErrorResponse(
  response: ErrorResponse | User
): response is ErrorResponse {
  return (response as ErrorResponse).violations !== undefined;
}

export function PersonalInformationsForm() {
  const { userData, setUserData } = useAuth();
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
    /*     email: yup
      .string()
      .email("Le format de l'adresse email est invalide.")
      .required("Ce champ est requis."),
    phone: yup.string().max(255),
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
    address: yup.string().max(255).required("Ce champ est requis."),
    city: yup.string().max(255).required("Ce champ est requis."),
    postalCode: yup
      .string()
      .matches(/^\d{5}$/, "Le code postal doit contenir 5 chiffres.")
      .required("Ce champ est requis."),
    country: yup.string().required("Ce champ est requis."), */
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
      firstname: userData.firstname,
      lastname: userData.lastname,
      //email: userData.email,
    },
  });

  const onSubmit = handleSubmit(async ({ firstname, lastname }) => {
    const [isSuccess, data] = await updateUser(userData.id, {
      firstname,
      lastname,
    });
    if (isSuccess && !isErrorResponse(data)) {
      setUserData(data);
      toast("success", "Votre compte a bien été mis à jour.");
    } else {
      if (isErrorResponse(data)) {
        data.violations?.forEach((violation: Violation) => {
          const invalidProperty: any = violation.propertyPath;
          setError(invalidProperty, {
            type: "manual",
            message: violation.message,
          });
        });
      }
    }
  });

  return (
    <div className="settings__personalInformations">
      <form className="settings__personalInformations-form" onSubmit={onSubmit}>
        <div className="settings__personalInformations-nameForm">
          {/*           <img
            src="https://via.placeholder.com/144"
            alt="Your profile picture."
          /> */}

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
        {/*         <div className="settings__personalInformations-contactForm">
          <h3>Contact</h3>
          <TextInput
            error={errors.email}
            label="Adresse email"
            {...register("email")}
          />
          <TextInput
            error={errors.phone}
            label="Numéro de téléphone"
            {...register("phone")}
          />
        </div>
        <div className="settings__personalInformations-companyForm">
          <h3>Entreprise</h3>
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
          {/*           <TextInput
            error={errors.tvaNumber}
            label="Pourcentage de TVA"
            {...register("tvaPercentage")}
          />
        </div>
        <div className="settings__personalInformations-addressForm">
          <h3>Adresse</h3>
          <TextInput
            error={errors.tvaNumber}
            label="Adresse"
            {...register("address")}
          />
          <div className="settings__personalInformations-addressForm-city">
            <TextInput
              error={errors.tvaNumber}
              label="Ville"
              {...register("city")}
            />
            <TextInput
              error={errors.tvaNumber}
              label="Code postal"
              {...register("postalCode")}
            />
          </div>
          <TextInput
            error={errors.tvaNumber}
            label="Pays"
            {...register("country")}
          />
        </div> */}
        <Button isLoading={isSubmitting} htmlType="submit" center={true}>
          Mettre à jour
        </Button>
      </form>
    </div>
  );
}
