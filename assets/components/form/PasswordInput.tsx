import React, { Ref, useState } from 'react';
import { FieldError } from 'react-hook-form';
import Icon from '../Icon';

type Props = {
    label?: string;
    name: string;
    error: FieldError | undefined;
}

const PasswordInput = (({ label, name, error }: Props, ref: Ref<HTMLInputElement>) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setShowPassword(p => !p);
    }

    return <div className={`form__group ${error ? "form--invalid" : ""}`}>
        {label && <label htmlFor={name} className="form__label">{label}</label>}
        <div className="form__rightIcon">
            <input ref={ref} type={showPassword ? "text" : "password"} aria-invalid={error ? "true" : "false"} id={name} name={name} className="form__input" />
            <button onClick={togglePasswordVisibility}>
                <Icon name={showPassword ? "eye-slash" : "eye"} />
            </button>
        </div>
        {error && <p role="alert" className="form--invalid-message">{error.message}</p>}
    </div>
})

export default React.forwardRef(PasswordInput);