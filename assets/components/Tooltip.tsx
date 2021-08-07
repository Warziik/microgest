import React, { ReactElement } from "react";

type Props = {
  isActive?: boolean;
  content: string;
  position?: "top" | "left" | "right" | "bottom";
  children: ReactElement;
};

export function Tooltip({
  isActive = true,
  content,
  position = "bottom",
  children,
}: Props) {
  return (
    (isActive && (
      <div className="tooltip">
        {children}
        <div
          role="tooltip"
          className={`tooltip__content tooltip__content--${position}`}
        >
          {content}
        </div>
      </div>
    )) ||
    children
  );
}
