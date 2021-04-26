import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Badge } from "../../../components/Badge";
import { Button } from "../../../components/Button";
import { useToast } from "../../../hooks/useToast";
import { fetchInvoice } from "../../../services/InvoiceService";
import { Invoice } from "../../../types/Invoice";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import Icon from "../../../components/Icon";
import { AddEditInvoiceForm } from "../AddEditInvoiceForm";
import { Modal } from "../../../components/Modal";
import { Tooltip } from "../../../components/Tooltip";

type MatchParams = {
    id: string;
}

export function ShowInvoice() {
    const {id} = useParams<MatchParams>();
    const history = useHistory();
    const toast = useToast();

    const [invoice, setInvoice] = useState<Invoice>();
    const [showEditInvoiceModal, setShowEditInvoiceModal] = useState(false);
    const openEditInvoiceModalBtn = useRef<HTMLButtonElement>(null);

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

    const editInvoice = (invoice: Invoice) => setInvoice(invoice);

    const closeEditInvoiceModal = () => {
        setShowEditInvoiceModal(false);
        openEditInvoiceModalBtn.current?.focus();
    }

    const openEditInvoiceModal = () => setShowEditInvoiceModal(true);

    const handleDownloadInvoice = () => {
        console.log("handle download invoice btn clicked!");
    }

    const handleDeleteBtn = () => console.log("delete btn clicked!");
    
    return <div className="showInvoice">
        {invoice && <Modal
            isOpen={showEditInvoiceModal}
            onClose={closeEditInvoiceModal}
            title="Éditer la facture"
            className="createInvoiceModal"
        >
            <AddEditInvoiceForm invoiceToEdit={invoice} changeInvoice={editInvoice} />
        </Modal>}
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
                    onClick={openEditInvoiceModal}
                    ref={openEditInvoiceModalBtn}
                    >Éditer</Button>

                    <Tooltip
                        isActive={invoice.status !== "NEW"}
                        content="Vous ne pouvez pas supprimer une facture qui a été envoyée, payée ou annulée."
                        position="bottom"
                    >
                        <Button
                            icon="trash"
                            className="btn--outline-danger"
                            disabled={invoice.status !== "NEW"}
                            onClick={invoice.status === "NEW" ? handleDeleteBtn : undefined}
                        >Supprimer</Button>
                    </Tooltip>
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
                    <p>{invoice.sentAt && dayjs(invoice.sentAt).format("LLLL") || "-"}</p>
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