import React, { useContext } from "react";
import { DELETE_NOTIFICATION, Toast as ToastType, ToastContext } from "../../contexts/ToastContext";
import Toast from "./Toast";

type Props = {
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    autoDeleteTimeout?: number;
}

export default function ToastContainer({ position = "top-right", autoDeleteTimeout = 4000 }: Props) {
    const { state, dispatch } = useContext(ToastContext);

    const deleteToast = (id: string) => dispatch({ type: DELETE_NOTIFICATION, payload: { id } });

    return <div className={`toast-container toast--${position}`}>
        {state.map((toast: ToastType) => (
            <Toast
                key={toast.id}
                data={toast}
                position={position}
                autoDeleteTimeout={autoDeleteTimeout}
                deleteToast={deleteToast}
            />
        ))}
    </div>
}