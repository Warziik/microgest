import React from "react";

type Props = {
    type?: "success" | "error" | "warning" | "info";
    message?: string;
    status?: "NEW" | "SENT" | "PAID" | "CANCELLED";
}

export function Badge({ type, message, status }: Props) {
    const getOptions = (status: string): any => {
        switch (status) {
            case "NEW":
                return ["info", "Nouveau"];
            case "SENT":
                return ["warning", "Envoyé"];
            case "PAID":
                return ["success", "Payé"];
            case "CANCELLED":
                return ["error", "Annulé"];
        }
    }

    const customType = type ?? (status ? getOptions(status)[0] : "error");
    const customMessage = message ?? (status ? getOptions(status)[1] : "Erreur");

    return <span className={`badge--${customType}`}>{customMessage}</span>
}