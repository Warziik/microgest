import React, { Ref } from 'react';
import Icon from './Icon';

type Props = {
    className?: string;
    icon?: string;
    children?: string;
    isLoading?: boolean;
    disabled?: boolean;
    onlyIcon?: boolean;
    onClick?(event: React.MouseEvent<HTMLButtonElement>): void;
}

const Button = React.forwardRef(({ className = "btn--primary", icon, onlyIcon = false, isLoading = false, disabled = false, onClick, children }: Props, ref: Ref<HTMLButtonElement>) => {
    return <button data-testid="button" ref={ref} disabled={isLoading || disabled} onClick={onClick} className={`${className} ${onlyIcon ? "btn--onlyIcon" : ""}`.trim()}>
        {isLoading && "Chargement..." || <>
            {icon && <Icon name={icon} />}
            {children}
        </>}
    </button>
});

Button.displayName = "Button";

export { Button };