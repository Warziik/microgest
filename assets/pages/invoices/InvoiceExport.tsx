import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Spinner } from "../../components/Spinner";
import { useToast } from "../../hooks/useToast";
import { fetchInvoice } from "../../services/InvoiceService";
import { Invoice, InvoiceService } from "../../types/Invoice";

type MatchParams = {
    id: string;
}

export function InvoiceExport() {
    const {id} = useParams<MatchParams>();
    const history = useHistory();
    const toast = useToast();

    const [invoice, setInvoice] = useState<Invoice>();

    useEffect(() => {
        if (Number.isNaN(id)) {
            history.push("/");
        } else {
            fetchInvoice(parseInt(id))
                .then((values: [boolean, Invoice]) => {
                    const [isSuccess, data] = values;
                    if (isSuccess) {
                        setInvoice(data);
                        
                        window.addEventListener("afterprint", () => {
                            history.push(`/factures/${data.id}`);
                        });
                        window.print();
                    } else {
                        toast("error", "La facture n'a pu être trouvée.");
                        history.push("/");
                    }
                });
        }
    }, [id, history, toast]);

    return invoice && <div className="invoiceExport">
        <div className="invoiceExport__companyDetails">
            <div>
                <h4>Nom</h4>
                <p>{invoice.customer.owner?.businessName ?? `${invoice.customer.owner?.firstname} ${invoice.customer.owner?.lastname}`}</p>
            </div>
            <div>
                <h4>Siret</h4>
                <p>{invoice.customer.owner?.siret}</p>
            </div>
            {invoice.customer.owner?.tvaNumber && <div>
                <h4>Numéro de TVA</h4>
                <p>{invoice.customer.owner.tvaNumber}</p>
            </div>}
        </div>
        <div className="invoiceExport__userDetails">
            <p>{invoice.customer.owner?.firstname} {invoice.customer.owner?.lastname}</p>
            <p>{invoice.customer.owner?.address}</p>
            <p>{invoice.customer.owner?.postalCode} {invoice.customer.owner?.city}</p>
        </div>
        <div className="invoiceExport__title">
            <h1>Facture</h1>
            <p>N°{invoice.chrono}</p>
        </div>
        <div className="invoiceExport__customerDetails">
            <div>
                <h4>Client</h4>
                <p>{invoice.customer.type === "PERSON" ? `${invoice.customer.firstname} ${invoice.customer.lastname}` : invoice.customer.company}</p>
            </div>
            {invoice.customer.type === "COMPANY" && <div>
                <h4>Siret</h4>
                <p>{invoice.customer.siret}</p>
            </div>}
            <div>
                <h4>Adresse</h4>
                <p>{invoice.customer.address}, {invoice.customer.postalCode} {invoice.customer.city}</p>
            </div>
            {invoice.customer.email && <div>
                <h4>Adresse email</h4>
                <p>{invoice.customer.email}</p>
            </div>}
            {invoice.customer.phone && <div>
                <h4>Numéro de Téléphone</h4>
                <p>{invoice.customer.phone}</p>
            </div>}
        </div>
        <table className="table invoiceExport__services">
            <thead>
                <tr>
                    <th>Prestation</th>
                    <th>Quantité</th>
                    <th>Prix unitaire</th>
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
                <p>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(invoice.totalAmount)}</p>
            </div>
            {invoice.tvaApplicable && <div className="invoiceExport__tva">
                <p>TVA</p>
                <p>20%</p>
            </div>}
            <div className="invoiceExport__totalAmount-ttc">
                <p>Total</p>
                <p>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(invoice.tvaApplicable ? invoice.totalAmount + (invoice.totalAmount * 20 / 100) : invoice.totalAmount)}</p>
            </div>
            {!invoice.tvaApplicable && <p className="invoiceExport__totalAmount-tvaText">TVA non applicable art. 2938 du CGI</p>}
        </div>
    </div> || <Spinner />;
}