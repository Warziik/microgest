import React, {useContext, useEffect, useState} from "react";
import {TextInput} from "../../../components/form/TextInput";
import {Option, SelectInput} from "../../../components/form/SelectInput";
import {Button} from "../../../components/Button";
import {useFormContext} from "react-hook-form";
import {StepperContext} from "../../../components/stepper/Stepper";
import {getNames as getCountries, alpha2ToAlpha3} from "i18n-iso-countries";

export function AddressStep() {
    const {nextStep, previousStep} = useContext(StepperContext);

    const {
        register,
        formState: {errors, isSubmitting},
        trigger,
        setValue
    } = useFormContext();

    const [selectCountryOptions, setSelectCountryOptions] = useState<Option[]>([]);

    const onSubmitStepTwo = async () => {
        const result = await trigger(["address", "city", "postalCode", "country"]);

        if (result) {
            nextStep();
        }
    };

    useEffect(() => {
        const options: Option[] = [];
        for (const [key, value] of Object.entries(getCountries("fr", {select: "official"}))) {
            options.push({value: alpha2ToAlpha3(key), label: value});
        }
        setSelectCountryOptions(options);
        setValue("country", options[0].value as string);
    }, []);

    return (
        <>
            <SelectInput
                error={errors.country}
                options={selectCountryOptions}
                label="Pays"
                {...register("country")}
            />
            <div className="settings__personalInformations-addressForm-city">
                <TextInput error={errors.city} label="Ville" {...register("city")} />
                <TextInput
                    error={errors.postalCode}
                    label="Code postal"
                    {...register("postalCode")}
                />
            </div>
            <TextInput
                error={errors.address}
                label="Adresse"
                {...register("address")}
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
