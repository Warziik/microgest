import React, {Ref, useEffect, useRef, useState} from "react";
import {FieldError} from "react-hook-form";
import Calendar from "react-calendar";
import dayjs from "dayjs";

type Props = {
    className?: string;
    label?: string;
    name: string;
    error?: FieldError;
    info?: string;
    onChange: (value: Date) => void;
    value: string | null;
}

const DatePickerInput = React.forwardRef(
    (
        {label, name, error, className, info, onChange, value}: Props,
        ref: Ref<HTMLInputElement>
    ) => {
        const datePickerRef = useRef<HTMLDivElement>(null);
        const [showCalendar, setShowCalendar] = useState(false);
        const [dateValue, setDateValue] = useState<Date>();

        useEffect(() => {
            setDateValue(value ? dayjs(value).toDate() : undefined);
        }, [value]);

        const handleDateChange = (value: Date) => {
            setDateValue(value);
            onChange(value);
            setShowCalendar(() => !showCalendar);
        }

        const handleClickOutside = (e: MouseEvent) => {
            if (!datePickerRef.current?.contains(e.target as Node)) setShowCalendar(false);
        };

        useEffect(() => {
            addEventListener("click", handleClickOutside);
            return () => removeEventListener("click", handleClickOutside);
        }, []);

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
                <div className="datepicker__wrapper" ref={datePickerRef}>
                    <input
                        ref={ref}
                        type="date"
                        aria-invalid={error ? "true" : "false"}
                        name={name}
                        value={dateValue ? dayjs(dateValue).format("YYYY-MM-DD") : ""}
                        readOnly={true}
                        onClick={e => {
                            e.preventDefault();
                            setShowCalendar(!showCalendar)
                        }}
                        required={true}
                        data-testid="datePicker"
                    />
                    {showCalendar && <Calendar
                        className="customFormCalendar"
                        value={dateValue}
                        onChange={handleDateChange}
                    />}
                </div>
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

export {DatePickerInput};
