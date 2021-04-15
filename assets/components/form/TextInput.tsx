import React, { Ref } from 'react';
import { FieldError } from 'react-hook-form';

type Props = {
    type?: "text" | "email" | "number";
    label?: string;
    name: string;
    error: FieldError | undefined;
    info?: string;
}

const TextInput = (({ type = "text", label, name, error, info }: Props, ref: Ref<HTMLInputElement>) => {
    return <div className={`form__group ${error ? "form--invalid" : ""}`}>
        {label && <label htmlFor={name} className="form__label">{label}</label>}
        <input ref={ref} aria-invalid={error ? "true" : "false"} type={type} id={name} name={name} className="form__input" />
        {error && <p role="alert" className="form--invalid-message">{error.message}</p>}
        {info && <p className="form__info">{info}</p>}
    </div>
})

export default React.forwardRef(TextInput);