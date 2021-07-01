import React from "react";
import { Invoice, InvoiceService } from "../types/Invoice";
import dayjs from "dayjs";

type Props = {
  invoice: Invoice;
};

export function GenerateInvoice({ invoice }: Props) {
  return (
    <div className="invoiceExport">
      <header className="invoiceExport__header">
        <div className="invoiceExport__userDetails">
          <p>
            {invoice.customer.owner?.businessName ??
              `${invoice.customer.owner?.firstname} ${invoice.customer.owner?.lastname}`}
          </p>
          <p>SIRET {invoice.customer.owner?.siret}</p>
          {invoice.customer.owner?.tvaNumber && (
            <p>Numéro de TVA {invoice.customer.owner.tvaNumber}</p>
          )}
          <p>{invoice.customer.owner?.address}</p>
          <p>
            {invoice.customer.owner?.postalCode} {invoice.customer.owner?.city}
          </p>
          <p>{invoice.customer.owner?.country}</p>
          {invoice.customer.owner?.phone && (
            <p>{invoice.customer.owner?.phone}</p>
          )}
          {invoice.customer.owner?.email && (
            <p>{invoice.customer.owner?.email}</p>
          )}
        </div>
        <div className="invoiceExport__title">
          <h1>Facture</h1>
          <p>N°{invoice.chrono}</p>
        </div>
        <div className="invoiceExport__customerDetails">
          <p>
            {invoice.customer.type === "PERSON"
              ? `${invoice.customer.firstname} ${invoice.customer.lastname}`
              : invoice.customer.company}
          </p>
          {invoice.customer.type === "COMPANY" && (
            <p>SIRET {invoice.customer.siret}</p>
          )}
          <p>{invoice.customer.address}</p>
          <p>
            {invoice.customer.postalCode} {invoice.customer.city}
          </p>
          <p>{invoice.customer.country}</p>
        </div>
      </header>
      <hr />
      <div className="invoiceExport__details">
        <div className="invoiceExport__details-item">
          <p>Date d&lsquo;émission</p>
          <p>{dayjs(invoice.createdAt).format("LLLL")}</p>
        </div>
        <div className="invoiceExport__details-item">
          <p>Date d&lsquo;exécution</p>
          <p>{dayjs(invoice.serviceDoneAt).format("dddd D MMMM YYYY")}</p>
        </div>
        <div className="invoiceExport__details-item">
          <p>Date limite de paiement</p>
          <p>{dayjs(invoice.paymentDeadline).format("dddd D MMMM YYYY")}</p>
        </div>
        <div className="invoiceExport__details-item">
          <p>Taux de pénalité en cas de retard</p>
          <p>{invoice.paymentDelayRate}% du montant total de la facturation</p>
        </div>
      </div>
      <table className="table invoiceExport__services">
        <thead>
          <tr>
            <th>Prestation réalisée</th>
            <th>Quantité</th>
            <th>Prix unitaire (HT)</th>
          </tr>
        </thead>
        <tbody>
          {invoice.services.map((service: InvoiceService) => (
            <tr key={service.id}>
              <td>
                {service.name}
                <span>{service.description}</span>
              </td>
              <td>{service.quantity}</td>
              <td>{service.unitPrice}€</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="invoiceExport__totalAmount">
        <div className="invoiceExport__totalAmount-ht">
          <p>Sous-total</p>
          <p>
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
            }).format(invoice.totalAmount)}
          </p>
        </div>
        {invoice.tvaApplicable && (
          <div className="invoiceExport__tva">
            <p>TVA</p>
            <p>20%</p>
          </div>
        )}
        <div className="invoiceExport__totalAmount-ttc">
          <p>Total TTC</p>
          <p>
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
            }).format(
              invoice.tvaApplicable
                ? invoice.totalAmount + (invoice.totalAmount * 20) / 100
                : invoice.totalAmount
            )}
          </p>
        </div>
        {!invoice.tvaApplicable && (
          <p className="invoiceExport__totalAmount-tvaText">
            TVA non applicable, art. 293 B du CGI
          </p>
        )}
      </div>
    </div>
  );
}
