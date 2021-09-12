import React, {useContext, useEffect, useState} from "react";
import {Option} from "../../../components/form/SelectInput";
import {Button} from "../../../components/Button";
import {useFormContext, FormProvider} from "react-hook-form";
import {StepperContext} from "../../../components/stepper/Stepper";
import {getNames as getCountries, alpha2ToAlpha3} from "i18n-iso-countries";
import {AddressFormPart} from "../../../components/form/parts/AddressFormPart";

export function AddressStep() {
    const {nextStep, previousStep} = useContext(StepperContext);

    const methods = useFormContext();
    const {trigger, setValue, formState: {isSubmitting}} = methods;

    const [selectCountryOptions, setSelectCountryOptions] = useState<Option[]>([]);

    const onSubmitStepTwo = async () => {
        const result = await trigger(["address", "city", "postalCode", "country"]);

        if (result) nextStep();
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
            <FormProvider {...methods}>
                <AddressFormPart selectCountryOptions={selectCountryOptions}/>
            </FormProvider>
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
