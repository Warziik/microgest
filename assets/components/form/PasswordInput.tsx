import React, {useState} from 'react';
import { FieldError } from 'react-hook-form';
import Icon from '../Icon';

type Props = {
    label?: string;
    name: string;
    error: FieldError | undefined;
}

const PasswordInput = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setShowPassword(p => !p);
    }

    return <div className={`form__group ${props.error ? "form--invalid" : ""}`}>
        {props.label && <label htmlFor={props.name} className="form__label">{props.label}</label>}
        <div className="form__rightIcon">
            <input ref={ref} type={showPassword ? "text" : "password"} id={props.name} name={props.name} className="form__input" />
            <button onClick={togglePasswordVisibility}>
                <Icon name={showPassword ? "eye-slash" : "eye"} />
            </button>
        </div>
        {props.error && <p role="alert" className="form--invalid-message">{props.error.message}</p>}
    </div>
})

export default PasswordInput;