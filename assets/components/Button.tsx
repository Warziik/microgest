import React, { Ref } from "react";
import { Icon } from "./Icon";

type Props = {
  htmlType?: "button" | "submit";
  type?: "fill" | "contrast" | "outline";
  color?: "primary" | "accent" | "danger";
  size?: "normal" | "small";
  center?: boolean;
  icon?: string;
  children?: string;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?(event: React.MouseEvent<HTMLButtonElement>): void;
};

const Button = React.forwardRef(
  (
    {
      htmlType = "button",
      icon,
      type = "fill",
      color = "primary",
      size = "normal",
      center = false,
      isLoading = false,
      disabled = false,
      onClick,
      children,
    }: Props,
    ref: Ref<HTMLButtonElement>
  ) => {
    return (
      <button
        type={htmlType}
        data-testid="button"
        ref={ref}
        disabled={isLoading || disabled}
        onClick={onClick}
        className={`btn-${type}--${color}--${size} ${
          !children ? "btn--onlyIcon" : ""
        } ${center ? "btn--center" : ""}`.trim()}
      >
        {(isLoading && "Chargement...") || (
          <>
            {icon && <Icon name={icon} />}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
