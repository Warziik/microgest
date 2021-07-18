import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useToast } from "../../../hooks/useToast";
import { deleteDevis, fetchDevis } from "../../../services/DevisService";
import { Devis } from "../../../types/Devis";
import { InvoiceService } from "../../../types/Invoice";
import dayjs from "dayjs";
import { Badge } from "../../../components/Badge";
import { Button } from "../../../components/Button";
import { Link } from "react-router-dom";
import { Icon } from "../../../components/Icon";
import { GenerateExportableDocument } from "../../../components/GenerateExportableDocument";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { Modal } from "../../../components/Modal";
import { EditDevisForm } from "../EditDevisForm";
import { Tooltip } from "../../../components/Tooltip";

type MatchParams = {
  id: string;
};

export function ShowDevis() {
  const { id } = useParams<MatchParams>();
  const history = useHistory();
  const toast = useToast();

  const [devis, setDevis] = useState<Devis>();

  const [showEditDevisModal, setShowEditDevisModal] = useState(false);
  const openEditDevisModalBtn = useRef<HTMLButtonElement>(null);
  const editDevis = (devis: Devis) => setDevis(devis);

  const [showDeleteDevisModal, setShowDeleteInvoiceModal] = useState(false);
  const openDeleteDevisModalBtn = useRef<HTMLButtonElement>(null);
  const openDeleteDevisModal = () => setShowDeleteInvoiceModal(true);

  useEffect(() => {
    if (Number.isNaN(id)) {
      history.push("/");
    } else {
      fetchDevis(parseInt(id)).then((values: [boolean, Devis]) => {
        const [isSuccess, data] = values;
        if (isSuccess) {
          setDevis(data);
        } else {
          toast("error", "Le devis n'a pu être trouvé.");
          history.push("/");
        }
      });
    }
  }, [id, history, toast]);

  useEffect(() => {
    document.title = `Devis n°${devis?.chrono} - Microgest`;
  }, [devis]);

  const openEditDevisModal = () => setShowEditDevisModal(true);

  const closeEditDevisModal = () => {
    setShowEditDevisModal(false);
    openEditDevisModalBtn.current?.focus();
  };

  const closeDeleteDevisModal = () => {
    setShowDeleteInvoiceModal(false);
    openDeleteDevisModalBtn.current?.focus();
  };

  const handleDeleteBtn = async () => {
    if (devis) {
      const [isSuccess] = await deleteDevis(devis.id);
      if (isSuccess) {
        history.push("/devis");
        toast("success", "Le devis a bien été supprimé.");
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
      {devis && (
        <Modal
          isOpen={showDeleteDevisModal}
          onClose={closeDeleteDevisModal}
          title="Supprimer le devis"
          className="deleteInvoiceModal"
        >
          <p>
            Êtes-vous sûr de vouloir supprimer le devis ? (action irréversible)
          </p>
          <div className="deleteInvoiceModal__ctas">
            <Button
              type="contrast"
              onClick={closeDeleteDevisModal}
              icon="close"
            >
              Annuler
            </Button>
            <Button onClick={handleDeleteBtn} icon="trash" color="danger">
              Supprimer
            </Button>
          </div>
        </Modal>
      )}
      {devis && (
        <Modal
          isOpen={showEditDevisModal}
          onClose={closeEditDevisModal}
          title={`Éditer le devis n°${devis.chrono}`}
          className="editInvoiceModal"
        >
          <EditDevisForm devisToEdit={devis} editDevis={editDevis} />
        </Modal>
      )}
      {(devis && (
        <>
          <Breadcrumb
            previousPage={{ name: "Mes devis", path: "/devis" }}
            currentPage={`Devis n°${devis.chrono}`}
          />
          <div className="showInvoice__main">
            <div className="showInvoice__header">
              <div className="showInvoice__header-title">
                <h1>Devis n°{devis.chrono}</h1>
                <p>Créée {dayjs(devis.createdAt).fromNow()} </p>
              </div>
              <div className="showInvoice__header-status">
                <Badge status={devis.status} />
                {devis.status === "SENT" && (
                  <p>
                    Envoyé le {dayjs(devis.sentAt).format("dddd DD MMMM YYYY")}
                  </p>
                )}
                {devis.status === "SIGNED" && (
                  <p>
                    Signé le {dayjs(devis.signedAt).format("dddd DD MMMM YYYY")}
                  </p>
                )}
              </div>
              <div className="showInvoice__header-ctas">
                <Button
                  type="contrast"
                  center={true}
                  icon="download"
                  onClick={() =>
                    history.push(`/devis-détails/${devis.id}/export`)
                  }
                >
                  Exporter le devis
                </Button>

                <Button
                  icon="edit"
                  type="outline"
                  onClick={openEditDevisModal}
                  ref={openEditDevisModalBtn}
                >
                  Éditer
                </Button>

                <Tooltip
                  isActive={devis.status !== "NEW"}
                  content="Vous ne pouvez pas supprimer un devis qui a été envoyé, signé ou annulé."
                  position="left"
                >
                  <Button
                    icon="trash"
                    type="outline"
                    color="danger"
                    disabled={devis.status !== "NEW"}
                    ref={openDeleteDevisModalBtn}
                    onClick={
                      devis.status === "NEW" ? openDeleteDevisModal : undefined
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
                    {devis.customer.type === "PERSON"
                      ? `${devis.customer.firstname} ${devis.customer.lastname}`
                      : devis.customer.company}
                  </p>
                  <Link
                    to={`/client/${devis.customer.id}`}
                    className="link-btn"
                  >
                    Voir plus
                    <Icon name="arrow-left" />
                  </Link>
                </div>
              </div>

              <div className="showInvoice__details-item">
                <h3>Détails</h3>
                <div className="customers__item-main-data">
                  <p>Date d&lsquo;émission</p>
                  <p>{dayjs(devis.createdAt).format("LLL")}</p>
                </div>
                <div className="customers__item-main-data">
                  <p>Date d&lsquo;expiration</p>
                  <p>{dayjs(devis.validityDate).format("LL")}</p>
                </div>
                <div className="customers__item-main-data">
                  <p>Date d&lsquo;exécution</p>
                  <p>{dayjs(devis.paymentDeadline).format("LL")}</p>
                </div>
                <div className="customers__item-main-data">
                  <p>Date de début de/des prestation(s)</p>
                  <p>{dayjs(devis.workStartDate).format("LL")}</p>
                </div>
                <div className="customers__item-main-data">
                  <p>Durée estimée</p>
                  <p>{devis.workDuration}</p>
                </div>
                <div className="customers__item-main-data">
                  <p>Date limite de règlement</p>
                  <p>{dayjs(devis.paymentDeadline).format("LL")}</p>
                </div>
                <div className="customers__item-main-data">
                  <p>Taux de pénalité en cas de retard</p>
                  <p>{devis.paymentDelayRate ?? 0}%</p>
                </div>
              </div>

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
                    {devis.services.map(
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
              <GenerateExportableDocument data={devis} />
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
      )) || <p>Chargement...</p>}
    </div>
  );
}
