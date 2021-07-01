import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "./Icon";

type Props = {
  previousPage: { path: string; name: string };
  currentPage: string;
};

export function Breadcrumb({ previousPage, currentPage }: Props) {
  return (
    <div className="breadcrumb">
      <div className="breadcrumb__item">
        <Link to={previousPage.path}>{previousPage.name}</Link>
      </div>
      <span className="breadcrumb__separator">
        <Icon name="chevron" />
      </span>
      <div className="breadcrumb__item--active">
        <p>{currentPage}</p>
      </div>
    </div>
  );
}
