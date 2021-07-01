import React from "react";

type Props = {
  name: string;
  className?: string;
};

export function Icon({ name, className }: Props) {
  return (
    <svg className={className}>
      <use xlinkHref={`../sprite.svg#icon-${name}`} />
    </svg>
  );
}
