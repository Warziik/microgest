import React, { Ref } from 'react';
import { FieldError } from 'react-hook-form';

export type Option = {
    label: string;
    value: string | number;
}

interface Props extends React.ComponentPropsWithoutRef<"select"> {
    label?: string;
    name: string;
    error: FieldError | undefined;
    options: Option[];
    className?: string;
    info?: string;
}

const SelectInput = React.forwardRef((
        {label, name, error, options, className, info, ...rest}: Props,
        ref: Ref<HTMLSelectElement>
    ) => {
    return <div className={`form__group form__select ${className ?? ""}`.trim()}>
        {label && <label htmlFor={name} className="form__label">{label}</label>}
        <select ref={ref} className="form__select" aria-invalid={error ? "true" : "false"} id={name} name={name} {...rest}>
            {options.map((option: Option, index: number) => (
                <option key={index} value={option.value}>{option.label}</option>
            ))}
        </select>
        {error && <p role="alert" className="form--invalid-message">{error.message}</p>}
        {info && <p className="form__info">{info}</p>}
    </div>
});

SelectInput.displayName = "SelectInput";

export {SelectInput};