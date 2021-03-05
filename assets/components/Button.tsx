import React from 'react';
import Icon from './Icon';

type Props = {
    className?: string;
    icon?: string;
    children: string;
    disabled: boolean | undefined;
    onClick?(event: React.MouseEvent<HTMLButtonElement>): void;
}

const Button = ({className = "btn--primary", icon, disabled, onClick, children}: Props) => {
    return <button disabled={disabled} onClick={onClick} className={className}>
        {icon && <Icon name={icon} />}
        {children}
    </button>
}

export default Button;