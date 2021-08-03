import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Badge } from "../../../components/Badge";
import { Button } from "../../../components/Button";
import { useToast } from "../../../hooks/useToast";
import { deleteInvoice, fetchInvoice } from "../../../services/InvoiceService";
import { Invoice, InvoiceService } from "../../../types/Invoice";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { Icon } from "../../../components/Icon";
import { EditInvoiceForm } from "../EditInvoiceForm";
import { Modal } from "../../../components/Modal";
import { Tooltip } from "../../../components/Tooltip";
import { GenerateExportableDocument } from "../../../components/GenerateExportableDocument";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { AddInvoiceForm } from "../AddInvoiceForm";
import { ShowInvoiceSkeleton } from "../../../components/skeletons/ShowInvoiceSkeleton";

type MatchParams = {
  id: string;
};

export function ShowInvoice() {
  const { id } = useParams<MatchParams>();
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
      fetchInvoice(parseInt(id)).then((values: [boolean, Invoice]) => {
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
    document.title = `${
      invoice ? `Facture n°${invoice.chrono}` : `Chargement...`
    } - Microgest`;
  }, [invoice]);

  const editInvoice = (invoice: Invoice) => setInvoice(invoice);

  const openEditInvoiceModal = () => setShowEditInvoiceModal(true);

  const closeEditInvoiceModal = () => {
    setShowEditInvoiceModal(false);
    openEditInvoiceModalBtn.current?.focus();
  };

  const openDeleteInvoiceModal = () => setShowDeleteInvoiceModal(true);

  const closeDeleteInvoiceModal = () => {
    setShowDeleteInvoiceModal(false);
    openDeleteInvoiceModalBtn.current?.focus();
  };

  const handleDeleteBtn = async () => {
    if (invoice) {
      const [isSuccess] = await deleteInvoice(invoice.id);
      if (isSuccess) {
        history.push("/factures");
        toast("success", "La facture a bien été supprimée.");
      } else {
        toast(
          "error",
          "Une erreur inattendue s&apos;est produite, veuillez réessayer plus tard."
        );
      }
    }
  };

  return (
    <div className="showInvoice">
      {(invoice && (
        <>
          <Modal
            isOpen={showDeleteInvoiceModal}
            onClose={closeDeleteInvoiceModal}
            title="Supprimer la facture"
            className="deleteInvoiceModal"
          >
            <p>
              Êtes-vous sûr de vouloir supprimer la facture ? (action
              irréversible)
            </p>
            <div className="deleteInvoiceModal__ctas">
              <Button
                type="contrast"
                onClick={closeDeleteInvoiceModal}
                icon="close"
              >
                Annuler
              </Button>
              <Button onClick={handleDeleteBtn} icon="trash" color="danger">
                Supprimer
              </Button>
            </div>
          </Modal>
          <Modal
            position={invoice.isDraft ? "right" : "center"}
            isOpen={showEditInvoiceModal}
            onClose={closeEditInvoiceModal}
            title={`Éditer la facture n°${invoice.chrono}`}
            className={
              invoice.isDraft ? "editDraftInvoiceModal" : "editInvoiceModal"
            }
          >
            {invoice.isDraft && (
              <AddInvoiceForm
                addInvoice={editInvoice}
                invoiceToEdit={invoice}
              />
            )}
            {!invoice.isDraft && (
              <EditInvoiceForm
                invoiceToEdit={invoice}
                editInvoice={editInvoice}
              />
            )}
          </Modal>
          <Breadcrumb
            previousPage={{ name: "Mes factures", path: "/factures" }}
            currentPage={`Facture n°${invoice.chrono}`}
          />
          <div className="showInvoice__main">
            <div className="showInvoice__header">
              <div className="showInvoice__header-title">
                <h1>Facture n°{invoice.chrono}</h1>
                <p>Créée {dayjs(invoice.createdAt).fromNow()} </p>
              </div>
              <div className="showInvoice__header-status">
                <Badge status={invoice.status} />
                {invoice.status === "SENT" && (
                  <p>
                    Envoyée le{" "}
                    {dayjs(invoice.sentAt).format("dddd DD MMMM YYYY")}
                  </p>
                )}
                {invoice.status === "PAID" && (
                  <p>
                    Payée le {dayjs(invoice.paidAt).format("dddd DD MMMM YYYY")}
                  </p>
                )}
              </div>
              <div className="showInvoice__header-ctas">
                <Tooltip
                  isActive={invoice.isDraft}
                  content="Vous ne pouvez pas exporter une facture brouillon."
                  position="top"
                >
                  <Button
                    type="contrast"
                    center={true}
                    icon="download"
                    disabled={invoice.isDraft}
                    onClick={
                      !invoice.isDraft
                        ? () => history.push(`/facture/${invoice.id}/export`)
                        : undefined
                    }
                  >
                    Exporter la facture
                  </Button>
                </Tooltip>

                <Button
                  icon="edit"
                  type="outline"
                  onClick={openEditInvoiceModal}
                  ref={openEditInvoiceModalBtn}
                >
                  Éditer
                </Button>

                <Tooltip
                  isActive={invoice.status !== "NEW"}
                  content="Vous ne pouvez pas supprimer une facture qui a été envoyée, payée ou annulée."
                  position="left"
                >
                  <Button
                    icon="trash"
                    type="outline"
                    color="danger"
                    disabled={invoice.status !== "NEW"}
                    ref={openDeleteInvoiceModalBtn}
                    onClick={
                      invoice.status === "NEW"
                        ? openDeleteInvoiceModal
                        : undefined
                    }
                  >
                    Supprimer
                  </Button>
                </Tooltip>
              </div>
            </div>

            <div className="showInvoice__details">
              <div className="showInvoice__details-item">
                <h3>Client associé</h3>
                <div className="showInvoice__customer">
                  <img src="https://via.placeholder.com/32" alt="" />
                  <p>
                    {invoice.customer.type === "PERSON"
                      ? `${invoice.customer.firstname} ${invoice.customer.lastname}`
                      : invoice.customer.company}
                  </p>
                  <Link
                    to={`/client/${invoice.customer.id}`}
                    className="link-btn"
                  >
                    Voir plus
                    <Icon name="arrow-left" />
                  </Link>
                </div>
              </div>

              <div className="showInvoice__details-item">
                <h3>Détails</h3>
                <div className="showInvoice__details-item-data">
                  <p>Date d&lsquo;émission</p>
                  <p>{dayjs(invoice.createdAt).format("LLL")}</p>
                </div>
                <div className="showInvoice__details-item-data">
                  <p>Date d&lsquo;exécution</p>
                  <p>{dayjs(invoice.serviceDoneAt).format("LL")}</p>
                </div>
                <div className="showInvoice__details-item-data">
                  <p>Date limite de règlement</p>
                  <p>{dayjs(invoice.paymentDeadline).format("LL")}</p>
                </div>
                <div className="showInvoice__details-item-data">
                  <p>Taux de pénalité en cas de retard</p>
                  <p>{invoice.paymentDelayRate ?? 0}%</p>
                </div>
              </div>

              {/*                 <div className="showInvoice__details-item">
                  <h3>Méthodes de paiement</h3>
                </div> */}

              <div className="showInvoice__details-item">
                <h3>Prestations réalisées</h3>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Qté</th>
                      <th>Prix (HT)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.services.map(
                      (service: InvoiceService, index: number) => (
                        <tr key={index}>
                          <td>{service.name}</td>
                          <td>{service.quantity}</td>
                          <td>{service.unitPrice}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="showInvoice__display">
              <GenerateExportableDocument data={invoice} />
            </div>
            {/*           <div className="showInvoice__other">
            <h3>Envoi de la facture par mail</h3>
            <p>
              Vous pouvez envoyer la facture par mail au client en y écrivant un
              message ci-dessous. Le mail sera ensuite envoyé à l’adresse email
              liée au client.
            </p>
            <form>
              <TextInput
                ref={undefined}
                type="textarea"
                name="message"
                error={undefined}
              />
              <Button icon="send" center={true} disabled={true}>
                Envoyer
              </Button>
            </form>
          </div> */}
          </div>
        </>
      )) || <ShowInvoiceSkeleton />}
    </div>
  );
}
