import React from 'react';

type Props = {
    name: string;
}

const Icon = ({name}: Props) => {
    return <svg>
        <use xlinkHref={`../sprite.svg#icon-${name}`} />
    </svg>
}

export default Icon;