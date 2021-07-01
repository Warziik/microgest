import React, { Ref } from "react";
import { FieldError } from "react-hook-form";

interface Props extends React.ComponentPropsWithoutRef<"input"> {
  type?: "date" | "datetime-local";
  label?: string;
  name: string;
  error: FieldError | undefined;
  className?: string;
  info?: string;
}

const DatePickerInput = React.forwardRef(
  (
    { type = "date", label, name, error, className, info, ...rest }: Props,
    ref: Ref<HTMLInputElement>
  ) => {
    return (
      <div
        className={`form__group form__datepicker ${
          error ? "form--invalid" : ""
        } ${className ?? ""}`.trim()}
      >
        {label && (
          <label htmlFor={name} className="form__label">
            {label}
          </label>
        )}
        <input
          data-testid="datePicker"
          ref={ref}
          aria-invalid={error ? "true" : "false"}
          type={type}
          id={name}
          name={name}
          className="form__input"
          {...rest}
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

DatePickerInput.displayName = "DatePickerInput";

export { DatePickerInput };
