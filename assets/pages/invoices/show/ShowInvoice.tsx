import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Badge } from "../../../components/Badge";
import { Button } from "../../../components/Button";
import { useToast } from "../../../hooks/useToast";
import { deleteInvoice, fetchInvoice } from "../../../services/InvoiceService";
import { Invoice, InvoiceService } from "../../../types/Invoice";
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

    const [showDeleteInvoiceModal, setShowDeleteInvoiceModal] = useState(false);
    const openDeleteInvoiceModalBtn = useRef<HTMLButtonElement>(null);

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

    const openEditInvoiceModal = () => setShowEditInvoiceModal(true);

    const closeEditInvoiceModal = () => {
        setShowEditInvoiceModal(false);
        openEditInvoiceModalBtn.current?.focus();
    }

    const openDeleteInvoiceModal = () => setShowDeleteInvoiceModal(true);

    const closeDeleteInvoiceModal = () => {
        setShowDeleteInvoiceModal(false);
        openDeleteInvoiceModalBtn.current?.focus();
    }

    const handleDeleteBtn = async () => {
        if (invoice) {
            const [isSuccess] = await deleteInvoice(invoice.id);
            if (isSuccess) {
                history.push("/factures");
                toast("success", "La facture a bien été supprimée.");
            } else {
                toast("error", "Une erreur inattendue s&apos;est produite, veuillez réessayer plus tard.");
            }
        }
    }
    
    return <div className="showInvoice">
        {invoice && <Modal
            isOpen={showDeleteInvoiceModal}
            onClose={closeDeleteInvoiceModal}
            title="Supprimer la facture"
            className="deleteInvoiceModal"
        >
            <p>Êtes-vous sûr de vouloir supprimer la facture ? (action irréversible)</p>
            <div className="deleteInvoiceModal__ctas">
                <Button className="btn--secondary" onClick={closeDeleteInvoiceModal} icon="close">Annuler</Button>
                <Button className="btn--primary" onClick={handleDeleteBtn} icon="trash">Supprimer</Button>
            </div>
        </Modal>}
        {invoice && <Modal
            isOpen={showEditInvoiceModal}
            onClose={closeEditInvoiceModal}
            title="Éditer la facture"
            className="addEditInvoiceModal"
        >
            <AddEditInvoiceForm invoiceToEdit={invoice} changeInvoice={editInvoice} />
        </Modal>}
        {invoice && <>
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
                            ref={openDeleteInvoiceModalBtn}
                            onClick={invoice.status === "NEW" ? openDeleteInvoiceModal : undefined}
                        >Supprimer</Button>
                    </Tooltip>
                </div>
                
                <div className="showInvoice__customer">
                    <h4>Client associé</h4>
                    <div className="showInvoice__customer-details">
                        <img src="https://via.placeholder.com/48" alt={`Photo de ${invoice.customer.firstname} ${invoice.customer.lastname}`} />
                        <h3>{invoice.customer.type === "PERSON" ? `${invoice.customer.firstname} ${invoice.customer.lastname}` : invoice.customer.company}</h3>
                        <p>{invoice.customer.email}</p>
                        <Link to={`/clients/${invoice.customer.id}`} className="link-btn">
                            Voir plus
                            <Icon name="arrow-left" />
                        </Link>
                    </div>
                </div>

                <div className="showInvoice__info">
                    <p>Prestations réalisées</p>
                    <p>{invoice.services.map((service: InvoiceService) => (
                        <span key={service.id}>{service.name}</span>
                    )) || "-"}</p>
                </div>

                <div className="showInvoice__info">
                    <p>Date d&lsquo;envoi</p>
                    <p>{invoice.sentAt && dayjs(invoice.sentAt).format("LLLL") || "-"}</p>
                </div>

                <div className="showInvoice__info">
                    <p>Date de paiement</p>
                    <p>{invoice.paidAt && dayjs(invoice.paidAt).fromNow() || "-"}</p>
                </div>

                <div className="showInvoice__info">
                    <p>Date d&lsquo;exécution</p>
                    <p>{invoice.serviceDoneAt && dayjs(invoice.serviceDoneAt).format("LLLL") || "-"}</p>
                </div>

                <div className="showInvoice__info">
                    <p>Date limite de règlement</p>
                    <p>{invoice.paymentDeadline && dayjs(invoice.paymentDeadline).format("LLLL") || "-"}</p>
                </div>

                <div className="showInvoice__info">
                    <p>Taux de pénalité en cas de retard</p>
                    <p>{invoice.paymentDelayRate && `${invoice.paymentDelayRate}%` || "-"}</p>
                </div>

                <div className="showInvoice__amount">
                    <p>Montant total (HT)</p>
                    <p>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(invoice.totalAmount)}</p>
                </div>

                <Button
                    className="btn--secondary btn--center"
                    icon="download"
                    onClick={() => history.push(`/factures/${invoice.id}/export`)}
                >Exporter la facture</Button>
            </div>
        </> || <p>Chargement...</p>}
    </div>
}