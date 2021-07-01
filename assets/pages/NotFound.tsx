import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";

export function NotFound() {
  return (
    <div className="notFound">
      <h1>404 Page introuvable</h1>
      <Link to="/" className="btn-outline--primary--normal">
        <Icon name="arrow-left" />
        Retour à la page d&lsquo;accueil
      </Link>
    </div>
  );
}
