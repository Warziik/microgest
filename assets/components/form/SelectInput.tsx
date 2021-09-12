import React, {Ref} from "react";
import {FieldError} from "react-hook-form";
import Select from "react-select";

export type Option = {
    label: string;
    value: string | number;
};

interface Props extends React.ComponentPropsWithoutRef<"select"> {
    label?: string;
    name: string;
    error?: FieldError;
    options: Option[];
    className?: string;
    info?: string;
    placeholder?: string;
    isSearchable?: boolean;
    noOptionMessage?: string;
    onChange?: any;
    onBlur?: any
    value?: any;
}

const SelectInput = React.forwardRef(
    (
        {
            label,
            name,
            error,
            options,
            className,
            info,
            placeholder,
            isSearchable = true,
            noOptionMessage = "Aucune option trouvée.",
            onChange,
            onBlur,
            value
        }: Props,
        ref: Ref<any>
    ) => {
        return (
            <div
                className={`form__group ${error ? "form--invalid" : ""} ${
                    className ?? ""
                }`.trim()}
            >
                {label && (
                    <label htmlFor={name} className="form__label">
                        {label}
                    </label>
                )}
                <Select
                    ref={ref}
                    className={className}
                    classNamePrefix="customFormSelect"
                    options={options}
                    placeholder={placeholder}
                    isSearchable={isSearchable}
                    noOptionsMessage={() => noOptionMessage}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    name={name}
                />
                {error && (
                    <p role="alert" className="form--invalid-message">
                        {error.message}
                    </p>
                )}
                {info && <p className="form__info">{info}</p>}
            </div>
        );
    }
);

SelectInput.displayName = "SelectInput";

export {SelectInput};
