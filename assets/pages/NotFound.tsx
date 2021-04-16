import React from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";

export function NotFound() {
    return <div className="notFound">
        <h1>404 Page introuvable</h1>
        <p>La page demandée n&apos;a pu être trouvée.</p>
        <Link to="/" className="btn--secondary">
            <Icon name="arrow-left" />
            Retour à la page d&lsquo;accueil
        </Link>
    </div>
}