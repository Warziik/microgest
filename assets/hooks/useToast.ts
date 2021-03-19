import { useContext } from "react";
import { ToastContext, ADD_NOTIFICATION } from "../contexts/ToastContext";

export function useToast() {
    const { dispatch } = useContext(ToastContext);

    return (type: string, message: string) => {
        dispatch({ type: ADD_NOTIFICATION, payload: { type, message } });
    }
}