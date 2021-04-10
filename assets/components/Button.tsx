import React, { Ref } from 'react';
import Icon from './Icon';

type Props = {
    className?: string;
    icon?: string;
    children: string;
    isLoading?: boolean;
    onClick?(event: React.MouseEvent<HTMLButtonElement>): void;
}

const Button = React.forwardRef(({ className = "btn--primary", icon, isLoading = false, onClick, children }: Props, ref: Ref<HTMLButtonElement>) => {
    return <button data-testid="button" ref={ref} disabled={isLoading} onClick={onClick} className={className}>
        {isLoading && "Chargement..." || <>
            {icon && <Icon name={icon} />}
            {children}
        </>}
    </button>
});

Button.displayName = "Button";

export { Button };