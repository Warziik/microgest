import React, { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { TextInput } from "../../../components/form/TextInput";
import { StepperContext } from "../../../components/stepper/Stepper";
import { Button } from "../../../components/Button";

export function CompanyStep() {
  const { previousStep } = useContext(StepperContext);

  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext();

  return (
    <>
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

      <div className="stepper__ctas">
        <Button onClick={previousStep} icon="arrow-left" type="contrast">
          Précédent
        </Button>
        <Button isLoading={isSubmitting} htmlType="submit" icon="user-plus">
          Créer mon compte
        </Button>
      </div>
    </>
  );
}
