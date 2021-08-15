import React, { useCallback, useEffect, useRef, useState } from "react";
import { Invoice } from "../../types/Invoice";
import { fetchAllInvoices } from "../../services/InvoiceService";
import { Collection } from "../../types/Collection";
import { Modal } from "../../components/Modal";
import { AddInvoiceForm } from "./AddInvoiceForm";
import { Button } from "../../components/Button";
import { InvoicesData } from "./InvoicesData";
import { InvoicesSkeleton } from "../../components/skeletons/InvoicesSkeleton";

export function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>();

  const [showCreateInvoiceModal, setShowCreateInvoiceModal] =
    useState<boolean>(false);
  const openCreateInvoiceModalBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.title = "Mes factures - Microgest";
  }, []);

  const fetchInvoices = useCallback(() => {
    fetchAllInvoices().then(
      (values: [boolean, Collection<Invoice> | any]) => {
        const [isSuccess, data] = values;
        if (isSuccess) {
          setInvoices(
            data["hydra:member"].sort((a: Invoice, b: Invoice) => {
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
      }
    );
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const addInvoice = (invoice: Invoice) => {
    if (invoices) setInvoices([...invoices, invoice]);
  };

  const closeCreateInvoiceModal = () => {
    setShowCreateInvoiceModal(false);
    openCreateInvoiceModalBtn.current?.focus();
  };

  const openCreateInvoiceModal = () => setShowCreateInvoiceModal(true);

  return (
    <div className="invoices">
      <Modal
        position="right"
        isOpen={showCreateInvoiceModal}
        onClose={closeCreateInvoiceModal}
        title="Nouvelle facture"
      >
        <AddInvoiceForm addInvoice={addInvoice} />
      </Modal>
      <div className="invoices__header">
        <h1>Vos factures</h1>
        <div className="invoices__header-ctas">
          <Button
            onClick={openCreateInvoiceModal}
            ref={openCreateInvoiceModalBtn}
            icon="add"
          >
            Créer une nouvelle facture
          </Button>
          {/*         <div className="invoices__pagination">
          <p>
            <strong>3 mois</strong> affichés par page
          </p>
          <div className="pagination"></div>
        </div> */}
        </div>
      </div>
      {(invoices && (
        <InvoicesData
          invoices={invoices}
          displayCustomer={true}
          displayUrls={true}
        />
      )) || <InvoicesSkeleton />}
    </div>
  );
}
