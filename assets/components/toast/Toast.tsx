import React, { useEffect, useState } from "react";
import { Toast } from "../../contexts/ToastContext";
import Icon from "../Icon";

type Props = {
    data: Toast;
    position: string;
    autoDeleteTimeout: number;
    deleteToast: (id: string) => void;
}

// TODO: Set values for aria-valuemin aria-valuemax aria-valuenow
export default function Toast({ data, position, autoDeleteTimeout, deleteToast }: Props) {
    const [isRunning, setIsRunning] = useState<boolean>(true);

    const [remainingTime, setRemainingTime] = useState<number>(autoDeleteTimeout);
    const [startTime, setStartTime] = useState<number>(Date.now());

    const style: React.CSSProperties = {
        animationDuration: `${autoDeleteTimeout}ms`,
        animationPlayState: isRunning ? "running" : "paused"
    }

    useEffect(() => {
        const timerId = setTimeout(() => {
            deleteToast(data.id);
        }, remainingTime);

        if (!isRunning) {
            clearTimeout(timerId);
        }

        return () => clearTimeout(timerId);
    })

    const handleMouseEnter = () => {
        setRemainingTime(rt => rt -= Date.now() - startTime)
        setIsRunning(false);
    }

    const handleMouseLeave = () => {
        setStartTime(Date.now());
        setIsRunning(true);
    }

    const typeIcon: Record<string, string> = {
        success: "check",
        error: "close",
        warning: "exclamation",
        info: "info"
    };

    return <div
        key={data.id}
        role="status"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`toast toast--${data.type} toast--${position}`}
    >
        <button className="toast__close" onClick={() => deleteToast(data.id)}><Icon name="close" /></button>
        <div className="toast__content">
            <div className="toast__content-icon"><Icon name={typeIcon[data.type]} /></div>
            <p className="toast__content-message">{data.message}</p>
        </div>
        <span
            role="progressbar"
            style={style}
            className="toast__progressbar"
        ></span>
    </div>
}