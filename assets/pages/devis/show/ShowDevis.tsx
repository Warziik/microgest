import React, {useEffect, useRef} from "react";
import {useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {useToast} from "../../../hooks/useToast";
import {deleteDevis, fetchDevis} from "../../../services/DevisService";
import {Devis} from "../../../types/Devis";
import {InvoiceService} from "../../../types/Invoice";
import dayjs from "dayjs";
import {Badge} from "../../../components/Badge";
import {Button} from "../../../components/Button";
import {Link} from "react-router-dom";
import {Icon} from "../../../components/Icon";
import {Breadcrumb} from "../../../components/Breadcrumb";
import {Modal} from "../../../components/Modal";
import {EditDevisForm} from "../EditDevisForm";
import {Tooltip} from "../../../components/Tooltip";
import {AddDevisForm} from "../AddDevisForm";
import {ShowInvoiceSkeleton} from "../../../components/skeletons/ShowInvoiceSkeleton";
import {downloadExportableDocument} from "../../../services/CommonService";

type MatchParams = {
    id: string;
};

export function ShowDevis() {
    const {id} = useParams<MatchParams>();
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
        document.title = `${
            devis ? `Devis n°${devis.chrono}` : `Chargement...`
        } - Microgest`;
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

    const handleDownloadFile = async () => {
        if (devis) {
            const isSuccess = await downloadExportableDocument("devis", devis.id);
            if (isSuccess) toast("success", "Le devis a bien été récupéré.");
            else toast("error", "Une erreur inattendue s&apos;est produite, veuillez réessayer plus tard.");
        }
    }

    return (
        <div className="showInvoice">
            {(devis && (
                <>
                    <Modal
                        isOpen={showDeleteDevisModal}
                        onClose={closeDeleteDevisModal}
                        title="Supprimer le devis"
                        className="deleteInvoiceModal"
                    >
                        <p>
                            Êtes-vous sûr de vouloir supprimer le devis ? (action
                            irréversible)
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
                    <Modal
                        position={devis.isDraft ? "right" : "center"}
                        isOpen={showEditDevisModal}
                        onClose={closeEditDevisModal}
                        title={`Éditer la devis`}
                        className={
                            devis.isDraft ? "editDraftInvoiceModal" : "editInvoiceModal"
                        }
                    >
                        {devis.isDraft && (
                            <AddDevisForm addDevis={editDevis} devisToEdit={devis}/>
                        )}
                        {!devis.isDraft && (
                            <EditDevisForm devisToEdit={devis} editDevis={editDevis}/>
                        )}
                    </Modal>
                    <Breadcrumb
                        previousPage={{name: "Mes devis", path: "/devis"}}
                        currentPage={`Devis n°${devis.chrono}`}
                    />
                    <div className="showInvoice__main">
                        <div className="showInvoice__header">
                            <div className="showInvoice__header-title">
                                <h1>Devis n°{devis.chrono}</h1>
                                <p>Créée {dayjs(devis.createdAt).fromNow()} </p>
                            </div>
                            <div className="showInvoice__header-status">
                                <Badge status={devis.status}/>
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
                                <Tooltip
                                    isActive={devis.isDraft}
                                    content="Vous ne pouvez pas télécharger un devis brouillon."
                                    position="top"
                                >
                                    <Button
                                        type="contrast"
                                        icon="download"
                                        onClick={
                                            !devis.isDraft
                                                ? () => handleDownloadFile()
                                                : undefined
                                        }
                                    >
                                        Télécharger le devis
                                    </Button>
                                </Tooltip>

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
                                    position="top"
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
                                    <img
                                        src={`${devis.customer.pictureUrl ?? "/images/default.png"}`}
                                        alt={
                                            devis.customer.type === "PERSON"
                                                ? `Photo de ${devis.customer.firstname} ${devis.customer.lastname}`
                                                : `Logo de ${devis.customer.company}`
                                        }
                                    />
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
                                        <Icon name="arrow-left"/>
                                    </Link>
                                </div>
                            </div>

                            <div className="showInvoice__details-item">
                                <h3>Détails</h3>
                                <div className="showInvoice__details-item-data">
                                    <p>Date d&lsquo;émission</p>
                                    <p>{dayjs(devis.createdAt).format("LLL")}</p>
                                </div>
                                <div className="showInvoice__details-item-data">
                                    <p>Date d&lsquo;expiration</p>
                                    <p>{dayjs(devis.validityDate).format("LL")}</p>
                                </div>
                                <div className="showInvoice__details-item-data">
                                    <p>Date d&lsquo;exécution</p>
                                    <p>{dayjs(devis.paymentDeadline).format("LL")}</p>
                                </div>
                                <div className="showInvoice__details-item-data">
                                    <p>Date de début de la prestation</p>
                                    <p>{dayjs(devis.workStartDate).format("LL")}</p>
                                </div>
                                <div className="showInvoice__details-item-data">
                                    <p>Durée estimée</p>
                                    <p>{devis.workDuration}</p>
                                </div>
                                <div className="showInvoice__details-item-data">
                                    <p>Date limite de règlement</p>
                                    <p>{dayjs(devis.paymentDeadline).format("LL")}</p>
                                </div>
                                <div className="showInvoice__details-item-data">
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
                                                <td data-label="Nom">{service.name}</td>
                                                <td data-label="Qté">{service.quantity}</td>
                                                <td data-label="Prix (HT)">{new Intl.NumberFormat("fr-FR", {
                                                    style: "currency",
                                                    currency: "EUR",
                                                }).format(service.unitPrice)}</td>
                                            </tr>
                                        )
                                    )}
                                    </tbody>
                                </table>
                            </div>
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
            )) || <ShowInvoiceSkeleton/>}
        </div>
    );
}
