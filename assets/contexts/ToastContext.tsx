import React, { createContext, ReactElement, useReducer } from "react";
import { uuid } from "../utils/uuid";

type Props = {
    children: ReactElement | ReactElement[];
}

export type Toast = {
    id: string;
    type: "success" | "error" | "warning" | "info";
    message: string;
}

type InitialType = {
    state: Toast[];
    dispatch: React.Dispatch<any>
}

export const ToastContext = createContext<InitialType>({ state: [], dispatch: () => null });

export const ADD_NOTIFICATION = "ADD_NOTIFICATION";
export const DELETE_NOTIFICATION = "DELETE_NOTIFICATION";

export function ToastContextProvider({ children }: Props) {
    const [state, dispatch] = useReducer((state: Toast[], action: any) => {
        switch (action.type) {
            case ADD_NOTIFICATION:
                return [...state, { id: uuid(), ...action.payload }];
            case DELETE_NOTIFICATION:
                return state.filter((toast: Toast) => toast.id !== action.payload.id);
            default:
                return state;
        }
    }, []);

    return <ToastContext.Provider value={{ state, dispatch }}>
        {children}
    </ToastContext.Provider>
}