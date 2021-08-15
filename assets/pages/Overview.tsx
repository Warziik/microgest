import React from "react";

export function Overview() {
  return (
    <div className="overview">
      <div className="overview__mainChart">
        <h2>Évolution de votre chiffre d&lsquo;affaire</h2>
      </div>
      <div className="overview__exportDocuments">
        <h2>Exporter vos documents</h2>
      </div>
      <div className="overview__lastAddedCustomers">
        <h2>Derniers clients ajoutés</h2>
      </div>
    </div>
  );
}
