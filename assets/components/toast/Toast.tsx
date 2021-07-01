import React, { useState } from "react";
import { Toast } from "../../contexts/ToastContext";
import { Icon } from "../Icon";

type Props = {
  data: Toast;
  position: string;
  autoDeleteTimeout: number;
  deleteToast: (id: string) => void;
};

// TODO: Set values for aria-valuemin aria-valuemax aria-valuenow
export function Toast({
  data,
  position,
  autoDeleteTimeout,
  deleteToast,
}: Props) {
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const style: React.CSSProperties = {
    animationDuration: `${autoDeleteTimeout}ms`,
    animationPlayState: isRunning ? "running" : "paused",
  };

  const typeIcon: Record<string, string> = {
    success: "check",
    error: "close",
    warning: "exclamation",
    info: "info",
  };

  const onMouseEnter = () => setIsRunning(false);
  const onMouseLeave = () => setIsRunning(true);

  const onAnimationEnd = (event: React.AnimationEvent<HTMLDivElement>) => {
    const animationClassName = event.animationName.split("-");
    if (animationClassName[animationClassName.length - 1] === "trackProgress") {
      clearToast();
    }
  };

  const clearToast = () => {
    setIsVisible(false);
    setTimeout(() => {
      deleteToast(data.id);
    }, 275);
  };

  return (
    <div
      role="status"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onAnimationEnd={onAnimationEnd}
      className={`toast toast--${
        data.type
      } toast--${position} toast--${position}-${isVisible ? "enter" : "leave"}`}
    >
      <button className="toast__close" onClick={clearToast}>
        <Icon name="close" />
      </button>
      <div className="toast__content">
        <div className="toast__content-icon">
          <Icon name={typeIcon[data.type]} />
        </div>
        <p className="toast__content-message">{data.message}</p>
      </div>
      <span
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={autoDeleteTimeout / 1000}
        style={style}
        className="toast__progressbar"
      ></span>
    </div>
  );
}
