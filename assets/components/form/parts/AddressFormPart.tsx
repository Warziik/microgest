import React from "react";
import {Option, SelectInput} from "../SelectInput";
import {TextInput} from "../TextInput";
import {Controller, useFormContext} from "react-hook-form";

type Props = {
    selectCountryOptions: Option[];
}

export function AddressFormPart({selectCountryOptions}: Props) {
    const {control, register, formState: {errors}} = useFormContext();
    return <>
        <Controller
            name="country"
            control={control}
            render={({field}) => (
                <SelectInput
                    error={errors.country}
                    label="Pays"
                    options={selectCountryOptions}
                    placeholder="Sélectionner le pays"
                    noOptionMessage="Aucun pays trouvé."
                    {...field}
                />
            )}
        />
        <div className="settings__personalInformations-addressForm-city">
            <TextInput
                error={errors.city}
                label="Ville"
                {...register("city")}
            />
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
    </>
}