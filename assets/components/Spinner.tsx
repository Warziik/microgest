import React from "react";

type Props = {
    type?: "circle";
    center?: boolean;
}

export function Spinner({ type = "circle", center = true }: Props) {
    return <div
        aria-busy={true}
        aria-live="polite"
        role="status"
        className={`spinner--${type} ${center ? "spinner--center" : ""}`}
    ></div>
}