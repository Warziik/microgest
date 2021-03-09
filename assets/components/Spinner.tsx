import React from "react";

type Props = {
    type?: "circle";
    center?: boolean;
}

const Spinner = ({type = "circle", center = true}: Props) => {
    return <div data-testid="spinner" className={`spinner--${type} ${center ? "spinner--center" : ""}`}></div>
}

export default Spinner;