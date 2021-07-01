import React from "react";
import { PasswordInput } from "../../../components/form/PasswordInput";
import { TextInput } from "../../../components/form/TextInput";
import { Button } from "../../../components/Button";
import { useFormContext } from "react-hook-form";
import { useContext } from "react";
import { StepperContext } from "../../../components/stepper/Stepper";

export function PersonalStep() {
  const { nextStep } = useContext(StepperContext);

  const {
    register,
    formState: { errors, isSubmitting },
    trigger,
  } = useFormContext();

  const onSubmitStepOne = async () => {
    const result = await trigger([
      "firstname",
      "lastname",
      "email",
      "phone",
      "password",
    ]);

    if (result) {
      nextStep();
    }
  };

  return (
    <>
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

      <TextInput
        error={errors.phone}
        label="Numéro de téléphone (facultatif)"
        {...register("phone")}
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

      <div className="stepper__ctas">
        <Button onClick={onSubmitStepOne} isLoading={isSubmitting}>
          Suivant
        </Button>
      </div>
    </>
  );
}
