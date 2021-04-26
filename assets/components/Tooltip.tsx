import React, { ReactElement, useState } from "react";

type Props = {
    isActive?: boolean;
    content: string;
    position?: "top" | "left" | "right" | "bottom";
    children: ReactElement;
}

export function Tooltip({isActive = true, content, position = "bottom", children}: Props) {
    const [isVisible, setIsVisible] = useState(false);

    return isActive && <div
        className="tooltip"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
    >
        {children}
        {isVisible && <div
            role="tooltip"
            className={`tooltip__content tooltip__content--${position} ${isVisible ? "tooltip__content--enter" : "tooltip__content--leave"}`}
        >
            {content}
        </div>
        }
    </div> || children;
}