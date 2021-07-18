import React, { useRef, useEffect } from "react";
import { Tabs } from "../../components/tab/Tabs";
import { Tab } from "../../components/tab/Tab";
import { Invoice } from "../../types/Invoice";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import dayjs from "dayjs";
import { useState } from "react";

type Props = {
  invoices: Invoice[];
  displayCustomer?: boolean;
  displayUrls?: boolean;
};

export function InvoicesData({
  invoices,
  displayCustomer = false,
  displayUrls = false,
}: Props) {
  const { pathname } = useLocation();
  const { push } = useHistory();

  //const [draftsInvoices, setDraftsInvoices] = useState<Invoice[]>();
  const [unpaidInvoices, setUnpaidInvoices] = useState<Invoice[]>();

  const allInvoicesRef = useRef(null);
  const draftsRef = useRef(null);
  const unpaidRef = useRef(null);

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

  useEffect(() => {
    setUnpaidInvoices(
      invoices.filter(
        (invoice: Invoice) =>
          invoice.paymentDeadline.slice(0, 19) <
          new Date().toISOString().slice(0, 19)
      )
    );
  }, [invoices]);

  return (
    <Tabs defaultActiveTab={displayUrls ? getDefaultTab() : 0}>
      <Tab
        title={"Toutes les factures"}
        url={displayUrls ? "/factures" : undefined}
        tabRef={allInvoicesRef}
      >
        <div className="invoices__list">
          {invoices.length > 0 && (
            <>
              <div className="invoices__list-header">
                <h3>Factures</h3>
                <p>
                  {invoices.length}{" "}
                  {invoices.length === 1 ? "facture émise" : "factures émises"}
                </p>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Chrono</th>
                    <th>Statut</th>
                    {displayCustomer && <th>Client</th>}
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
                      {displayCustomer && (
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
                      )}
                      <td>
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        }).format(invoice.totalAmount)}
                      </td>
                      <td>{dayjs(invoice.serviceDoneAt).fromNow()}</td>
                      <td>{dayjs(invoice.createdAt).fromNow()}</td>
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
            </>
          )}
          {invoices.length === 0 && <p>Aucune facture pour le moment.</p>}
        </div>
      </Tab>
      <Tab
        title={"Brouillons"}
        url={displayUrls ? "/factures/brouillons" : undefined}
        tabRef={draftsRef}
      >
        <div className="invoices__list">
          <p>Aucun brouillon pour le moment.</p>
        </div>
      </Tab>
      <Tab
        title={"Impayées"}
        url={displayUrls ? "/factures/impayées" : undefined}
        tabRef={unpaidRef}
      >
        <div className="invoices__list">
          {unpaidInvoices && unpaidInvoices.length > 0 && (
            <>
              <div className="invoices__list-header">
                <h3>Factures</h3>
                <p>
                  {unpaidInvoices.length}{" "}
                  {unpaidInvoices.length === 1
                    ? "facture impayée"
                    : "factures impayées"}
                </p>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Chrono</th>
                    <th>Statut</th>
                    {displayCustomer && <th>Client</th>}
                    <th>Montant total (HT)</th>
                    <th>Date limite de règlement</th>
                    <th>Taux de pénalité dû au retard</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {unpaidInvoices.map((invoice: Invoice, index: number) => (
                    <tr key={index}>
                      <td>
                        <Link className="link" to={`/facture/${invoice.id}`}>
                          {invoice.chrono}
                        </Link>
                      </td>
                      <td>
                        <Badge status={invoice.status} />
                      </td>
                      {displayCustomer && (
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
                      )}
                      <td>
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        }).format(invoice.totalAmount)}
                      </td>
                      <td>{dayjs(invoice.paymentDeadline).fromNow()}</td>
                      <td>
                        {invoice.paymentDelayRate}% de la somme totale TTC
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
            </>
          )}
          {unpaidInvoices?.length === 0 && <p>Aucun impayé pour le moment.</p>}
        </div>
      </Tab>
    </Tabs>
  );
}
