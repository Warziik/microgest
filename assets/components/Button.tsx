import React from 'react';
import Icon from './Icon';

type Props = {
    className?: string;
    icon?: string;
    children: string;
    isLoading?: boolean;
    onClick?(event: React.MouseEvent<HTMLButtonElement>): void;
}

export function Button({ className = "btn--primary", icon, isLoading = false, onClick, children }: Props) {
    return <button data-testid="button" disabled={isLoading} onClick={onClick} className={className}>
        {isLoading && "Chargement..." || <>
            {icon && <Icon name={icon} />}
            {children}
        </>}
    </button>
}