import React from "react";

export function ExportDocuments() {
    return <div className="overview__exportDocuments">
        <h2>Exporter vos documents</h2>
        <p>Vous pouvez exporter l’ensemble de vos factures et devis émis depuis la création de votre compte.
            Cela comprend également les brouillons.</p>
        <p className="unaivalable-message">
            Indisponible pour le moment.
        </p>
        {/*        <Button type="contrast" icon="edit">Exporter au format Excel</Button>
        <Button type="contrast" color="accent" icon="edit">Exporter au format PDF</Button>*/}
    </div>
}