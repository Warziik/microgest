import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Badge } from "../../../components/Badge";
import { Button } from "../../../components/Button";
import { useToast } from "../../../hooks/useToast";
import { fetchInvoice } from "../../../services/InvoiceService";
import { Invoice } from "../../../types/Invoice";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import Icon from "../../../components/Icon";

type MatchParams = {
    id: string;
}

export function ShowInvoice() {
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
                    } else {
                        toast("error", "La facture n'a pu être trouvée.");
                        history.push("/");
                    }
                });
        }
    }, [id, history, toast]);

    useEffect(() => {
        document.title = `Facture n°${invoice?.chrono} - Microgest`;
    }, [invoice]);

    const handleDownloadInvoice = () => {
        console.log("handle download invoice btn clicked!");
    }
    
    return <div className="showInvoice">
        {invoice && <>
            <div className="showInvoice__preview"></div>
            <div className="showInvoice__details">
                <div className="showInvoice__title">
                    <h2>Facture n°{invoice.chrono}</h2>
                    <Badge status={invoice.status} />
                </div>
                
                <div className="showInvoice__ctas">
                    <Button
                        icon="edit"
                        className="btn--outline"
                    >
                        Éditer
                    </Button>
                    <Button icon="trash" className="btn--outline-danger">Supprimer</Button>
                </div>
                
                <div className="showInvoice__customer">
                    <h4>Client associé</h4>
                    <div className="showInvoice__customer-details">
                        <img src="https://via.placeholder.com/48" alt={`Photo de ${invoice.customer.firstname} ${invoice.customer.lastname}`} />
                        <h3>{invoice.customer.firstname} {invoice.customer.lastname}</h3>
                        <p>{invoice.customer.email}</p>
                        <Link to={`/clients/${invoice.customer.id}`} className="link-btn">
                            Voir plus
                            <Icon name="arrow-left" />
                        </Link>
                    </div>
                </div>

                <div className="showInvoice__info">
                    <p>Prestation réalisée</p>
                    <p>{invoice.service}</p>
                </div>

                <div className="showInvoice__info">
                    <p>Date d&lsquo;envoi</p>
                    <p>{invoice.sentAt && dayjs(invoice.sentAt).format("LL") || "-"}</p>
                </div>

                <div className="showInvoice__info">
                    <p>Date de paiement</p>
                    <p>{invoice.paidAt && dayjs(invoice.paidAt).fromNow() || "-"}</p>
                </div>

                <div className="showInvoice__amount">
                    <p>Montant total</p>
                    <p>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(invoice.amount)}</p>
                </div>

                <Button
                    className="btn--secondary btn--center"
                    icon="download"
                    onClick={handleDownloadInvoice}
                >Télécharger la facture</Button>
            </div>
        </> || <p>Chargement...</p>}
    </div>
}