import React, { useEffect, useState } from "react";
import { Toast } from "../../contexts/ToastContext";
import Icon from "../Icon";

type Props = {
    data: Toast;
    position: string;
    autoDeleteTimeout: number;
    deleteToast: (id: string) => void;
}

export default function Toast({ data, position, autoDeleteTimeout, deleteToast }: Props) {
    const [isRunning] = useState(true);

    const style: React.CSSProperties = {
        animationDuration: `${autoDeleteTimeout}ms`,
        animationPlayState: isRunning ? "running" : "paused"
    }

    //let startTime = Date.now();
    useEffect(() => {
        /*
        let timer: NodeJS.Timeout;

        timer = setTimeout(() => {
            deleteToast(data.id);
        }, autoDeleteTimeout);

        console.log("DEFAULT TIMEOUT VALUE", autoDeleteTimeout);

        if (!isRunning) {
            clearTimeout(timer);
            autoDeleteTimeout = (Date.now() - startTime) * 1000;

            timer = setTimeout(() => {
                deleteToast(data.id);
            }, autoDeleteTimeout);
        }
        */

        const timer = setTimeout(() => {
            deleteToast(data.id);
        }, autoDeleteTimeout);

        return () => clearTimeout(timer);
    });

    //const handleMouseOver = () => setIsRunning(r => !r);

    const typeIcon: Record<string, string> = {
        success: "check",
        error: "close",
        warning: "exclamation",
        info: "info"
    };

    return <div key={data.id} role="status" className={`toast toast--${data.type} toast--${position}`}>
        <button className="toast__close" onClick={() => deleteToast(data.id)}><Icon name="close" /></button>
        <div className="toast__content">
            <div className="toast__content-icon"><Icon name={typeIcon[data.type]} /></div>
            <p className="toast__content-message">{data.message}</p>
        </div>
        <span
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
            style={style}
            className="toast__progressbar"
        ></span>
    </div>
}