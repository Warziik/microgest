import React from "react";
import { Invoice, InvoiceService } from "../types/Invoice";
import dayjs from "dayjs";
import { Devis } from "../types/Devis";

const isInvoice = (object: any): object is Invoice =>
  (object as Invoice)["@type"] === "Invoice";

const isDevis = (object: any): object is Devis =>
  (object as Devis)["@type"] === "Devis";

type Props = {
  data: Invoice | Devis;
};

export function GenerateExportableDocument({ data }: Props) {
  return (
    <div className="invoiceExport">
      <header className="invoiceExport__header">
        <div className="invoiceExport__userDetails">
          <p>
            {data.customer.owner?.businessName ??
              `${data.customer.owner?.firstname} ${data.customer.owner?.lastname}`}
          </p>
          <p>SIRET {data.customer.owner?.siret}</p>
          {data.customer.owner?.tvaNumber && (
            <p>Numéro de TVA {data.customer.owner.tvaNumber}</p>
          )}
          <p>{data.customer.owner?.address}</p>
          <p>
            {data.customer.owner?.postalCode} {data.customer.owner?.city}
          </p>
          <p>{data.customer.owner?.country}</p>
          {data.customer.owner?.email && <p>{data.customer.owner?.email}</p>}
        </div>
        <div className="invoiceExport__title">
          <h1>{isInvoice(data) ? "Facture" : "Devis"}</h1>
          <p>N°{data.chrono}</p>
        </div>
        <div className="invoiceExport__customerDetails">
          <p>
            {data.customer.type === "PERSON"
              ? `${data.customer.firstname} ${data.customer.lastname}`
              : data.customer.company}
          </p>
          {data.customer.type === "COMPANY" && (
            <p>SIRET {data.customer.siret}</p>
          )}
          <p>{data.customer.address}</p>
          <p>
            {data.customer.postalCode} {data.customer.city}
          </p>
          <p>{data.customer.country}</p>
        </div>
      </header>
      <hr />
      <div className="invoiceExport__details">
        <div className="invoiceExport__details-item">
          <p>Date d&lsquo;émission</p>
          <p>{dayjs(data.createdAt).format("LLLL")}</p>
        </div>
        {isDevis(data) && (
          <div className="invoiceExport__details-item">
            <p>Date d&lsquo;expiration</p>
            <p>{dayjs(data.validityDate).format("dddd D MMMM YYYY")}</p>
          </div>
        )}
        {isInvoice(data) && (
          <div className="invoiceExport__details-item">
            <p>Date d&lsquo;exécution</p>
            <p>{dayjs(data.serviceDoneAt).format("dddd D MMMM YYYY")}</p>
          </div>
        )}
        {isDevis(data) && (
          <div className="invoiceExport__details-item">
            <p>Date de début de la/les prestation(s)</p>
            <p>{dayjs(data.workStartDate).format("dddd D MMMM YYYY")}</p>
          </div>
        )}
        {isDevis(data) && (
          <div className="invoiceExport__details-item">
            <p>Durée estimée de la/les prestation(s)</p>
            <p>{data.workDuration}</p>
          </div>
        )}
        <div className="invoiceExport__details-item">
          <p>Date limite de paiement</p>
          <p>{dayjs(data.paymentDeadline).format("dddd D MMMM YYYY")}</p>
        </div>
        <div className="invoiceExport__details-item">
          <p>Taux de pénalité en cas de retard</p>
          <p>{data.paymentDelayRate}% du montant total de la facturation</p>
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
          {data.services.map((service: InvoiceService) => (
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

          {isInvoice(data) && (
            <p>
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
              }).format(data.totalAmount)}
            </p>
          )}
        </div>
        {data.tvaApplicable && (
          <div className="invoiceExport__tva">
            <p>TVA</p>
            <p>20%</p>
          </div>
        )}
        <div className="invoiceExport__totalAmount-ttc">
          <p>Total TTC</p>
          {isInvoice(data) && (
            <p>
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
              }).format(
                data.tvaApplicable
                  ? data.totalAmount + (data.totalAmount * 20) / 100
                  : data.totalAmount
              )}
            </p>
          )}
        </div>
        {!data.tvaApplicable && (
          <p className="invoiceExport__totalAmount-tvaText">
            TVA non applicable, art. 293 B du CGI
          </p>
        )}
      </div>
    </div>
  );
}
