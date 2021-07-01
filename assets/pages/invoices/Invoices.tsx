import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Badge } from "../../components/Badge";
import { Invoice } from "../../types/Invoice";
import { fetchAllInvoicesOfUser } from "../../services/InvoiceService";
import dayjs from "dayjs";
import { Collection } from "../../types/Collection";
import { Modal } from "../../components/Modal";
import { AddInvoiceForm } from "./AddInvoiceForm";
import { Button } from "../../components/Button";
import { Tabs } from "../../components/tab/Tabs";
import { Tab } from "../../components/tab/Tab";

export function Invoices() {
  const { pathname } = useLocation();
  const { push } = useHistory();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] =
    useState<boolean>(false);
  const openCreateInvoiceModalBtn = useRef<HTMLButtonElement>(null);

  const allInvoicesRef = useRef(null);
  const draftsRef = useRef(null);
  const dueRef = useRef(null);

  useEffect(() => {
    document.title = "Mes factures - Microgest";
  }, []);

  const fetchInvoices = useCallback(() => {
    fetchAllInvoicesOfUser().then(
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

  const addInvoice = (invoice: Invoice) => setInvoices([...invoices, invoice]);

  const closeCreateInvoiceModal = () => {
    setShowCreateInvoiceModal(false);
    openCreateInvoiceModalBtn.current?.focus();
  };

  const openCreateInvoiceModal = () => setShowCreateInvoiceModal(true);

  const getDefaultTab = () => {
    switch (pathname) {
      case "/factures":
        return 0;
      case "/factures/brouillons":
        return 1;
      case "/factures/impayées":
        return 2;
    }
  };

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
      <Tabs defaultActiveTab={getDefaultTab()}>
        <Tab
          title={"Toutes les factures"}
          url="/factures"
          tabRef={allInvoicesRef}
        >
          <div className="invoices__list">
            <div className="invoices__list-header">
              <h3>Factures</h3>
              <p>{invoices.length} factures émises</p>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Chrono</th>
                  <th>Statut</th>
                  <th>Client</th>
                  <th>Montant total (HT)</th>
                  <th>Date d&lsquo;exécution</th>
                  <th>Date d&lsquo;émission</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice: Invoice, index: number) => (
                  <tr key={index}>
                    <td>
                      <Link className="link" to={`/facture/${invoice.id}`}>
                        {invoice.chrono}
                      </Link>
                    </td>
                    <td>
                      <Badge status={invoice.status} />
                    </td>
                    <td>
                      <Link
                        className="link"
                        to={`/client/${invoice.customer.id}`}
                      >
                        {invoice.customer.type === "PERSON"
                          ? `${invoice.customer.firstname} ${invoice.customer.lastname}`
                          : invoice.customer.company}
                      </Link>
                    </td>
                    <td>
                      {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      }).format(invoice.totalAmount)}
                    </td>
                    <td>
                      {(invoice.serviceDoneAt &&
                        dayjs(invoice.serviceDoneAt).fromNow()) ||
                        "-"}
                    </td>
                    <td>
                      {(invoice.createdAt &&
                        dayjs(invoice.createdAt).fromNow()) ||
                        "-"}
                    </td>
                    <td>
                      <Button
                        type="contrast"
                        size="small"
                        onClick={() => push(`/facture/${invoice.id}/export`)}
                      >
                        Exporter
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tab>
        <Tab title={"Brouillons"} url="/factures/brouillons" tabRef={draftsRef}>
          <div className="invoices__list">
            <p>Aucune facture brouillon pour le moment.</p>
          </div>
        </Tab>
        <Tab title={"Impayées"} url="/factures/impayées" tabRef={dueRef}>
          <div className="invoices__list">
            <p>Aucune facture impayée pour le moment.</p>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
