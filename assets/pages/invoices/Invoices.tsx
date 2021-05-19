import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../../components/Badge";
import { Invoice } from "../../types/Invoice";
import { fetchAllInvoicesOfUser } from "../../services/InvoiceService";
import dayjs from "dayjs";
import { Collection } from "../../types/Collection";
import { Modal } from "../../components/Modal";
import { AddInvoiceForm } from "./AddInvoiceForm";
import { Button } from "../../components/Button";

export function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] =
    useState<boolean>(false);
  const openCreateInvoiceModalBtn = useRef<HTMLButtonElement>(null);

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

  return (
    <div className="invoices">
      <Modal
        isOpen={showCreateInvoiceModal}
        onClose={closeCreateInvoiceModal}
        title="Nouvelle facture"
        className="addInvoiceModal"
      >
        <AddInvoiceForm addInvoice={addInvoice} />
      </Modal>
      <div className="invoices__ctas">
        <Button
          onClick={openCreateInvoiceModal}
          ref={openCreateInvoiceModalBtn}
          icon="add"
        >
          Créer une nouvelle facture
        </Button>
      </div>
      <div className="invoices__list">
        <table className="table">
          <thead>
            <tr>
              <th>Chrono</th>
              <th>Montant total (HT)</th>
              <th>Statut</th>
              <th>Client</th>
              <th>Date d&lsquo;envoi</th>
              <th>Date de paiement</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice: Invoice, index: number) => (
              <tr key={index}>
                <td>
                  <Link to={`/factures/${invoice.id}`}>{invoice.chrono}</Link>
                </td>
                <td>
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(invoice.totalAmount)}
                </td>
                <td>
                  <Badge status={invoice.status} />
                </td>
                <td>
                  <Link to={`/clients/${invoice.customer.id}`}>
                    {invoice.customer.type === "PERSON"
                      ? `${invoice.customer.firstname} ${invoice.customer.lastname}`
                      : invoice.customer.company}
                  </Link>
                </td>
                <td>
                  {(invoice.sentAt && dayjs(invoice.sentAt).fromNow()) || "-"}
                </td>
                <td>
                  {(invoice.paidAt && dayjs(invoice.paidAt).fromNow()) || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
