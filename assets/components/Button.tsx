import React from 'react';
import Icon from './Icon';

type Props = {
    className?: string;
    icon?: string;
    children: string;
    isDisabled?: boolean;
    onClick?(event: React.MouseEvent<HTMLButtonElement>): void;
}

const Button = ({className = "btn--primary", icon, isDisabled = false, onClick, children}: Props) => {
    return <button data-testid="button" disabled={isDisabled} onClick={onClick} className={className}>
        {icon && <Icon name={icon} />}
        {children}
    </button>
}

export default Button;