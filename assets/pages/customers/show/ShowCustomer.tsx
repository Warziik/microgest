import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import { Badge } from "../../../components/Badge";
import { Button } from "../../../components/Button";
import { useToast } from "../../../hooks/useToast";
import {
  deleteCustomer,
  fetchCustomer,
} from "../../../services/CustomerService";
import { fetchAllInvoicesOfCustomer } from "../../../services/InvoiceService";
import { Collection } from "../../../types/Collection";
import { Customer } from "../../../types/Customer";
import { ErrorResponse } from "../../../types/ErrorResponse";
import { Invoice } from "../../../types/Invoice";
import dayjs from "dayjs";
import { Option, SelectInput } from "../../../components/form/SelectInput";
import { useForm } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { AddEditCustomerForm } from "../AddEditCustomerForm";
import { Tabs } from "../../../components/tab/Tabs";
import { Tab } from "../../../components/tab/Tab";
import { Breadcrumb } from "../../../components/Breadcrumb";

type MatchParams = {
  id: string;
};

export function ShowCustomer() {
  const { id } = useParams<MatchParams>();
  const history = useHistory();
  const toast = useToast();
  const allInvoicesRef = useRef(null);
  const draftsRef = useRef(null);
  const dueRef = useRef(null);

  const { register, watch } = useForm<{ dataType: "INVOICES" | "DEVIS" }>({
    mode: "onChange",
    defaultValues: { dataType: "INVOICES" },
  });

  const [customer, setCustomer] = useState<Customer>();
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);
  const openEditCustomerModalBtn = useRef<HTMLButtonElement>(null);

  const [showDeleteCustomerModal, setShowDeleteCustomerModal] = useState(false);
  const openDeleteCustomerModalBtn = useRef<HTMLButtonElement>(null);

  const selectDataTypeOptions: Option[] = [
    { value: "INVOICES", label: "Afficher les factures associées" },
    {
      value: "PRE_INVOICES",
      label: "Afficher les Factures d’acomptes associées",
    },
    { value: "DEVIS", label: "Afficher les devis associés" },
    { value: "AVOIRS", label: "Afficher les avoirs associés" },
  ];

  useEffect(() => {
    if (Number.isNaN(id)) {
      history.push("/");
    } else {
      fetchCustomer(parseInt(id)).then(
        (values: [boolean, Customer | ErrorResponse]) => {
          const [isSuccess, data] = values;
          if (isSuccess) {
            const customerData = data as Customer;
            setCustomer(customerData);
            fetchAllInvoicesOfCustomer(customerData.id).then(
              (values: [boolean, Collection<Invoice> | any]) => {
                const [isSuccess, data] = values;
                if (isSuccess) setInvoices(data["hydra:member"]);
              }
            );
          } else {
            toast("error", "Le client n'a pu être trouvé.");
            history.push("/");
          }
        }
      );
    }
  }, [id, history, toast]);

  useEffect(() => {
    document.title =
      customer?.type === "PERSON"
        ? `${customer?.firstname} ${customer?.lastname} `
        : customer?.company + `- Microgest`;
  }, [customer]);

  const editCustomer = (customer: Customer) => setCustomer(customer);

  const openEditCustomerModal = () => setShowEditCustomerModal(true);

  const closeEditCustomerModal = () => {
    setShowEditCustomerModal(false);
    openEditCustomerModalBtn.current?.focus();
  };

  const openDeleteCustomerModal = () => setShowDeleteCustomerModal(true);

  const closeDeleteCustomerModal = () => {
    setShowDeleteCustomerModal(false);
    openDeleteCustomerModalBtn.current?.focus();
  };

  const handleDeleteBtn = async () => {
    if (customer) {
      const [isSuccess] = await deleteCustomer(customer.id);
      if (isSuccess) {
        history.push("/clients");
        toast("success", "Le client a bien été supprimé.");
      } else {
        toast(
          "error",
          "Une erreur inattendue s&apos;est produite, veuillez réessayer plus tard."
        );
      }
    }
  };

  return (
    <>
      {customer && (
        <>
          <Modal
            isOpen={showDeleteCustomerModal}
            onClose={closeDeleteCustomerModal}
            title="Supprimer le client"
            className="deleteInvoiceModal"
          >
            <p>
              Êtes-vous sûr de vouloir supprimer le client et toutes les données
              associées ? (action irréversible)
            </p>
            <div className="deleteInvoiceModal__ctas">
              <Button
                type="contrast"
                onClick={closeDeleteCustomerModal}
                icon="close"
              >
                Annuler
              </Button>
              <Button color="danger" onClick={handleDeleteBtn} icon="trash">
                Supprimer
              </Button>
            </div>
          </Modal>
          <Modal
            position="right"
            isOpen={showEditCustomerModal}
            onClose={closeEditCustomerModal}
            title="Éditer le client"
            className="addCustomerModal"
          >
            <AddEditCustomerForm
              customerToEdit={customer}
              changeCustomer={editCustomer}
            />
          </Modal>
        </>
      )}
      <div className="showCustomer">
        {customer && (
          <Breadcrumb
            previousPage={{ name: "Mes clients", path: "/clients" }}
            currentPage={
              customer.type === "PERSON"
                ? `${customer.firstname} ${customer.lastname}`
                : `${customer.company}`
            }
          />
        )}
        <div className="showCustomer__header">
          {(customer && (
            <>
              <img
                src="https://via.placeholder.com/72"
                alt={
                  customer.type === "PERSON"
                    ? `Photo de ${customer.firstname} ${customer.lastname}`
                    : `Logo de ${customer.company}`
                }
              />
              <h2>
                {customer.type === "PERSON"
                  ? `${customer.firstname} ${customer.lastname}`
                  : customer.company}
              </h2>
              <p className="showCustomer__header-createdAt">
                Ajouté {dayjs(customer.createdAt).fromNow()}
              </p>

              <Button
                icon="edit"
                type="outline"
                onClick={openEditCustomerModal}
                ref={openEditCustomerModalBtn}
              >
                Éditer
              </Button>
              <Button
                icon="trash"
                type="outline"
                color="danger"
                onClick={openDeleteCustomerModal}
                ref={openDeleteCustomerModalBtn}
              >
                Supprimer
              </Button>
            </>
          )) || <p>Chargement...</p>}
        </div>

        <div className="showCustomer__details">
          <div className="showCustomer__details-item">
            <p>Adresse email</p>
            <p>{customer?.email}</p>
          </div>
          {customer?.phone && (
            <div className="showCustomer__details-item">
              <p>Numéro de téléphone</p>
              <p>{customer?.phone}</p>
            </div>
          )}
          {customer?.type === "COMPANY" && (
            <div className="showCustomer__details-item">
              <p>Numéro SIRET</p>
              <p>{customer?.siret}</p>
            </div>
          )}
          <div className="showCustomer__details-item">
            <p>Adresse</p>
            <p>{`${customer?.address}, ${customer?.postalCode} ${customer?.city}`}</p>
          </div>
          <div className="showCustomer__details-item">
            <p>Pays</p>
            <p>{customer?.country}</p>
          </div>
        </div>

        <div className="showCustomer__taskBar">
          {(invoices && (
            <>
              <p>
                <strong>{invoices.length}</strong> factures associées.
              </p>
              <form>
                <SelectInput
                  error={undefined}
                  options={selectDataTypeOptions}
                  {...register("dataType")}
                />
              </form>
              <Button icon="filter" type="outline" disabled={true}>
                Filtrer
              </Button>
              {/*               <Button icon="download" type="contrast">
                Exporter au format Excel
              </Button>
              <Button
                icon="download"
                type="contrast"
                color="accent"
              >
                Exporter au format PDF
              </Button> */}
            </>
          )) || <p>Chargement...</p>}
        </div>

        {watch("dataType") === "INVOICES" && (
          <Tabs defaultActiveTab={0}>
            <Tab title={"Toutes les factures"} tabRef={allInvoicesRef}>
              <div className="invoices__list">
                <div className="invoices__list-header">
                  <h3>Factures</h3>
                  <p>{invoices.length} factures émises</p>
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Chrono</th>
                      <th>Statut</th>
                      <th>Montant total (HT)</th>
                      <th>Date d&lsquo;exécution</th>
                      <th>Date d&lsquo;émission</th>
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
                        <td>
                          {new Intl.NumberFormat("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                          }).format(invoice.totalAmount)}
                        </td>
                        <td>
                          {(invoice.serviceDoneAt &&
                            dayjs(invoice.serviceDoneAt).fromNow()) ||
                            "-"}
                        </td>
                        <td>
                          {(invoice.createdAt &&
                            dayjs(invoice.createdAt).fromNow()) ||
                            "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Tab>
            <Tab title={"Brouillons"} tabRef={draftsRef}>
              <div className="invoices__list">
                <p>Aucune facture brouillon pour le moment.</p>
              </div>
            </Tab>
            <Tab title={"Impayées"} tabRef={dueRef}>
              <div className="invoices__list">
                <p>Aucune facture impayée pour le moment.</p>
              </div>
            </Tab>
          </Tabs>
        )}
      </div>
    </>
  );
}
