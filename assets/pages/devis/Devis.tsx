import React, { useCallback, useEffect, useRef, useState } from "react";
import { fetchAllDevis } from "../../services/DevisService";
import { Collection } from "../../types/Collection";
import { Devis } from "../../types/Devis";
import { Button } from "../../components/Button";
import { DevisData } from "./DevisData";
import { Modal } from "../../components/Modal";
import { AddDevisForm } from "./AddDevisForm";
import { InvoicesSkeleton } from "../../components/skeletons/InvoicesSkeleton";

export function Devis() {
  const [devis, setDevis] = useState<Devis[]>();

  const [showCreateDevisModal, setShowCreateDevisModal] =
    useState<boolean>(false);
  const openCreateDevisModalBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.title = "Mes devis - Microgest";
  }, []);

  const fetchDevis = useCallback(() => {
    fetchAllDevis().then((values: [boolean, Collection<Devis> | any]) => {
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

  const addDevis = (newDevis: Devis) => {
    if (devis) setDevis([...devis, newDevis]);
  };

  const closeCreateDevisModal = () => {
    setShowCreateDevisModal(false);
    openCreateDevisModalBtn.current?.focus();
  };

  const openCreateDevisModal = () => setShowCreateDevisModal(true);

  return (
    <div className="invoices">
      <Modal
        position="right"
        isOpen={showCreateDevisModal}
        onClose={closeCreateDevisModal}
        title="Nouveau devis"
      >
        <AddDevisForm addDevis={addDevis} />
      </Modal>
      <div className="invoices__header">
        <h1>Vos devis</h1>
        <div className="invoices__header-ctas">
          <Button
            onClick={openCreateDevisModal}
            ref={openCreateDevisModalBtn}
            icon="add"
          >
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
      {(devis && (
        <DevisData devis={devis} displayCustomer={true} displayUrls={true} />
      )) || <InvoicesSkeleton />}
    </div>
  );
}
