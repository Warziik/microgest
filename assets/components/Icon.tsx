import React from 'react';

type Props = {
    name: string;
    className?: string;
}

const Icon = ({ name, className }: Props) => {
    return <svg className={className}>
        <use xlinkHref={`../sprite.svg#icon-${name}`} />
    </svg>
}

export default Icon;