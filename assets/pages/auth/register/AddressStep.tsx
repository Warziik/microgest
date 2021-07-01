import React, { useContext } from "react";
import { TextInput } from "../../../components/form/TextInput";
import { Option, SelectInput } from "../../../components/form/SelectInput";
import { Button } from "../../../components/Button";
import { useFormContext } from "react-hook-form";
import { StepperContext } from "../../../components/stepper/Stepper";

export function AddressStep() {
  const { nextStep, previousStep } = useContext(StepperContext);

  const {
    register,
    formState: { errors, isSubmitting },
    trigger,
  } = useFormContext();

  const selectCountryOptions: Option[] = [{ value: "FRA", label: "France" }];

  const onSubmitStepTwo = async () => {
    const result = await trigger(["address", "city", "postalCode", "country"]);

    if (result) {
      nextStep();
    }
  };

  return (
    <>
      <TextInput
        error={errors.address}
        label="Adresse"
        {...register("address")}
      />
      <div className="settings__personalInformations-addressForm-city">
        <TextInput error={errors.city} label="Ville" {...register("city")} />
        <TextInput
          error={errors.postalCode}
          type="number"
          label="Code postal"
          {...register("postalCode")}
        />
      </div>
      <SelectInput
        error={errors.country}
        options={selectCountryOptions}
        label="Pays"
        {...register("country")}
      />

      <div className="stepper__ctas">
        <Button onClick={previousStep} icon="arrow-left" type="contrast">
          Précédent
        </Button>
        <Button onClick={onSubmitStepTwo} isLoading={isSubmitting}>
          Suivant
        </Button>
      </div>
    </>
  );
}
