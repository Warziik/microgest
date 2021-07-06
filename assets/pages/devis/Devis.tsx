import React, { useCallback, useEffect, useState } from "react";
import { fetchAllDevisOfUser } from "../../services/DevisService";
import { Collection } from "../../types/Collection";
import { Devis } from "../../types/Devis";
import { Button } from "../../components/Button";
import { DevisData } from "./DevisData";

export function Devis() {
  const [devis, setDevis] = useState<Devis[]>([]);

  useEffect(() => {
    document.title = "Mes devis - Microgest";
  }, []);

  const fetchDevis = useCallback(() => {
    fetchAllDevisOfUser().then((values: [boolean, Collection<Devis> | any]) => {
      const [isSuccess, data] = values;
      if (isSuccess) {
        setDevis(
          data["hydra:member"].sort((a: Devis, b: Devis) => {
            if (a.chrono < b.chrono) {
              return -1;
            }
            if (a.chrono > b.chrono) {
              return 1;
            }
            return 0;
          })
        );
      }
    });
  }, []);

  useEffect(() => {
    fetchDevis();
  }, [fetchDevis]);

  return (
    <div className="devis">
      <div className="devis__header">
        <h1>Vos devis</h1>
        <div className="devis__header-ctas">
          <Button icon="add" disabled={true}>
            Créer un nouveau devis
          </Button>
          {/*         <div className="invoices__pagination">
          <p>
            <strong>3 mois</strong> affichés par page
          </p>
          <div className="pagination"></div>
        </div> */}
        </div>
      </div>
      <DevisData devis={devis} displayCustomer={true} displayUrls={true} />
    </div>
  );
}
