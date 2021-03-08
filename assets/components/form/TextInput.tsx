import React from 'react';
import { FieldError } from 'react-hook-form';

type Props = {
    type?: "text" | "email";
    label?: string;
    name: string;
    error: FieldError | undefined;
}

const TextInput = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
    return <div className={`form__group ${props.error ? "form--invalid" : ""}`}>
        {props.label && <label htmlFor={props.name} className="form__label">{props.label}</label>}
        <input ref={ref} type={props.type ?? "text"} id={props.name} name={props.name} className="form__input" />
        {props.error && <p role="alert" className="form--invalid-message">{props.error.message}</p>}
    </div>
})

export default TextInput;