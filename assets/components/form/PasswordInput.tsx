import React, { Ref, useState } from "react";
import { FieldError } from "react-hook-form";
import { Icon } from "../Icon";

interface Props extends React.ComponentPropsWithoutRef<"input"> {
  label?: string;
  name: string;
  error: FieldError | undefined;
}

const PasswordInput = React.forwardRef(
  ({ label, name, error, ...rest }: Props, ref: Ref<HTMLInputElement>) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      e.preventDefault();
      setShowPassword((p) => !p);
    };

    return (
      <div className={`form__group ${error ? "form--invalid" : ""}`}>
        {label && (
          <label htmlFor={name} className="form__label">
            {label}
          </label>
        )}
        <div className="form__rightIcon">
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            aria-invalid={error ? "true" : "false"}
            id={name}
            name={name}
            className="form__input"
            {...rest}
          />
          <button onClick={togglePasswordVisibility}>
            <Icon name={showPassword ? "eye-slash" : "eye"} />
          </button>
        </div>
        {error && (
          <p role="alert" className="form--invalid-message">
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
