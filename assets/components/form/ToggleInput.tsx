import React, { Ref } from "react";
import Icon from "../Icon";

interface Props extends React.ComponentPropsWithoutRef<"input"> {
    type?: "checkbox" | "switch";
    label: string;
    name: string;
    checked?: boolean;
}

const ToggleInput = React.forwardRef((
        {type = "checkbox", label, name, checked = false, ...rest}: Props,
        ref: Ref<HTMLInputElement>
    ) => {
    return <div className={`form__group form__switch`}>
        {type === "switch" && <>
            <p className="form__label">{label}</p>
            <label htmlFor={name} className="form__switch-label">
                <input ref={ref} type="checkbox" name={name} id={name} defaultChecked={checked} {...rest} />
                <span className="form__switch-custom">
                    <Icon name="close" className="form__switch-custom-closeIcon" />
                    <Icon name="check" className="form__switch-custom-checkIcon" />
                </span>
            </label>
        </> ||
        <>
            <input type="checkbox" ref={ref} name={name} id={name} defaultChecked={checked} {...rest} />
            <label htmlFor={name} className="form__label">{label}</label>
        </>}
    </div>
});

ToggleInput.displayName = "ToggleInput";

export {ToggleInput};