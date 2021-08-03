import React from "react";

type Props = {
  type: "text" | "avatar" | "title" | "btn-normal" | "btn-small" | "block";
};

export function SkeletonElement({ type }: Props) {
  return (
    <>
      <div className={`skeleton--${type}`}></div>
    </>
  );
}
