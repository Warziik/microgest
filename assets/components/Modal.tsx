import React, { createContext, ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";

export const ModalContext = createContext<{ onClose: () => void }>({ onClose: () => null });

type Props = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    className?: string;
    children: ReactNode;
}

export function Modal({ isOpen = false, onClose, title, className, children }: Props) {
    const modalRef = useRef<HTMLDivElement>(null);

    let focusableElements: HTMLElement[] = [];
    if (modalRef.current) {
        focusableElements = Array.from(modalRef.current.querySelectorAll(
            "button, a, input, select, textarea"
        ));
    }

    useEffect(() => {
        if (isOpen) addEventListener("keydown", handleKeyDown);

        return () => removeEventListener("keydown", handleKeyDown);
    });

    const onAnimationEnd = () => {
        if (modalRef.current?.parentElement?.style.visibility === "visible") {
            focusableElements[0].focus();
        }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();

        if (e.key === "Tab") {
            e.preventDefault();

            let index = focusableElements.findIndex((f: HTMLElement) => f === modalRef.current?.querySelector(":focus"));

            if (e.shiftKey) index--;
            else index++;

            if (index >= focusableElements.length) index = 0;
            if (index < 0) index = focusableElements.length - 1;

            focusableElements[index].focus();
        }
    }

    return createPortal(<div
        className={`modal ${className ?? ""}`.trim()}
        aria-labelledby="modalTitle"
        aria-hidden={!isOpen}
        aria-modal={isOpen}
        role="dialog"
        style={{ visibility: isOpen ? "visible" : "hidden" }}
        onAnimationEnd={onAnimationEnd}
    >
        <div className="modal__content" ref={modalRef}>
            <button className="modal__close" onClick={onClose} aria-label="Fermer">
                <Icon name="close" />
            </button>
            <h2 id="modalTitle" className="modal__title">{title}</h2>
            <ModalContext.Provider value={{ onClose }}>
                {children}
            </ModalContext.Provider>
        </div>
    </div >, document.body);
}