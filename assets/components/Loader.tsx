import React from "react";

type Props = {
    type?: "circle";
    center?: boolean;
}

export function Loader({ type = "circle", center = true }: Props) {
    return <div
        data-testid="loader"
        aria-busy={true}
        aria-live="polite"
        className={`loader--${type} ${center ? "loader--center" : ""}`}
    ></div>
}