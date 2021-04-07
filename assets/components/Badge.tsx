import React from "react";

type Props = {
    type: "success" | "error" | "warning" | "info";
    message: string;
}

export function Badge({ type, message }: Props) {
    return <span className={`badge--${type}`}>{message}</span>
}