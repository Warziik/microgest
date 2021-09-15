import React, {Ref} from "react";
import {FieldError} from "react-hook-form";

interface Props extends React.ComponentPropsWithoutRef<"input"> {
    type?: "text" | "email" | "number" | "textarea";
    label?: string;
    name: string;
    error: FieldError | undefined;
    info?: string;
}

const TextInput = React.forwardRef(
    (
        {type = "text", label, name, error, info, ...rest}: Props,
        ref: Ref<any>
    ) => {
        return (
            <div className={`form__group ${error ? "form--invalid" : ""}`.trim()}>
                {label && (
                    <label htmlFor={name} className="form__label">
                        {label}
                    </label>
                )}
                {(type === "textarea" && (
                    <textarea
                        ref={ref}
                        aria-invalid={error ? "true" : "false"}
                        id={name}
                        name={name}
                        className="form__textarea"
                    ></textarea>
                )) || (
                    <input
                        ref={ref}
                        aria-invalid={error ? "true" : "false"}
                        type={type}
                        id={name}
                        name={name}
                        className="form__input"
                        {...rest}
                    />
                )}
                {error && error.message !== "" && (
                    <p role="alert" className="form--invalid-message">
                        {error.message}
                    </p>
                )}
                {info && <p className="form__info">{info}</p>}
            </div>
        );
    }
);

TextInput.displayName = "TextInput";

export {TextInput};
