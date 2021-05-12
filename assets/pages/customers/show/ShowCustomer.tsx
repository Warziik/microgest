import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import { Badge } from "../../../components/Badge";
import { Button } from "../../../components/Button";
import { useToast } from "../../../hooks/useToast";
import { deleteCustomer, fetchCustomer } from "../../../services/CustomerService";
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

type MatchParams = {
    id: string;
}

export function ShowCustomer() {
    const {id} = useParams<MatchParams>();
    const history = useHistory();
    const toast = useToast();

    const {register, watch} = useForm<{dataType: "INVOICES" | "DEVIS"}>(
        {mode: "onChange", defaultValues: {dataType: "INVOICES"}}
    );

    const [customer, setCustomer] = useState<Customer>();
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);
    const openEditCustomerModalBtn = useRef<HTMLButtonElement>(null);

    const [showDeleteCustomerModal, setShowDeleteCustomerModal] = useState(false);
    const openDeleteCustomerModalBtn = useRef<HTMLButtonElement>(null);

    const selectDataTypeOptions: Option[] = [
        {value: "INVOICES", label: "Afficher les factures associées"},
        {value: "DEVIS", label: "Afficher les devis associées"},
    ]

    useEffect(() => {
        if (Number.isNaN(id)) {
            history.push("/");
        } else {
            fetchCustomer(parseInt(id))
                .then((values: [boolean, Customer | ErrorResponse]) => {
                    const [isSuccess, data] = values;
                    if (isSuccess) {
                        const customerData = data as Customer;
                        setCustomer(customerData);
                        fetchAllInvoicesOfCustomer(customerData.id).then((values: [boolean, Collection<Invoice> | any]) => {
                            const [isSuccess, data] = values;
                            if (isSuccess) setInvoices(data["hydra:member"]);
                        });
                    } else {
                        toast("error", "Le client n'a pu être trouvé.");
                        history.push("/");
                    }
                });
        }
    }, [id, history, toast]);

    useEffect(() => {
        document.title = customer?.type === "PERSON" ? `${customer?.firstname} ${customer?.lastname} ` : customer?.company + `- Microgest`;
    }, [customer]);

    const editCustomer = (customer: Customer) => setCustomer(customer);

    const openEditCustomerModal = () => setShowEditCustomerModal(true);

    const closeEditCustomerModal = () => {
        setShowEditCustomerModal(false);
        openEditCustomerModalBtn.current?.focus();
    }
    
    const openDeleteCustomerModal = () => setShowDeleteCustomerModal(true);

    const closeDeleteCustomerModal = () => {
        setShowDeleteCustomerModal(false);
        openDeleteCustomerModalBtn.current?.focus();
    }

    const handleDeleteBtn = async () => {
        if (customer) {
            const [isSuccess] = await deleteCustomer(customer.id);
            if (isSuccess) {
                history.push("/clients");
                toast("success", "Le client a bien été supprimé.");
            } else {
                toast("error", "Une erreur inattendue s&apos;est produite, veuillez réessayer plus tard.");
            }
        }
    }

    return <div className="customerDetails">
        {customer && <Modal
            isOpen={showDeleteCustomerModal}
            onClose={closeDeleteCustomerModal}
            title="Supprimer le client"
            className="deleteInvoiceModal"
        >
            <p>Êtes-vous sûr de vouloir supprimer le client et les factures associées ? (action irréversible)</p>
            <div className="deleteInvoiceModal__ctas">
                <Button className="btn--secondary" onClick={closeDeleteCustomerModal} icon="close">Annuler</Button>
                <Button className="btn--primary" onClick={handleDeleteBtn} icon="trash">Supprimer</Button>
            </div>
        </Modal>}
        {customer && <Modal
            isOpen={showEditCustomerModal}
            onClose={closeEditCustomerModal}
            title="Éditer le client"
            className="addCustomerModal"
        >
            <AddEditCustomerForm customerToEdit={customer} changeCustomer={editCustomer} />
        </Modal>}
        <div className="customerDetails__header">
            {customer && <>
                <img src="https://via.placeholder.com/72" alt={customer.type === "PERSON" ? `Photo de ${customer.firstname} ${customer.lastname}` : `Logo de ${customer.company}`} />
                <h2>{customer.type === "PERSON" ? `${customer.firstname} ${customer.lastname}` : customer.company}</h2>
                <p className="customerDetails__header-createdAt">Ajouté {dayjs(customer.createdAt).fromNow()}</p>

                <div className="customerDetails__header-infos">
                    <div className="customerDetails__header-info">
                        <p>Adresse email</p>
                        <p>{customer.email}</p>
                    </div>
                    <div className="customerDetails__header-info">
                        <p>Numéro de téléphone</p>
                        <p>{customer.phone ?? "-"}</p>
                    </div>
                    <div className="customerDetails__header-info">
                        <p>Numéro SIRET</p>
                        <p>{customer.siret ?? "-" }</p>
                    </div>
                </div>

                <Button
                    icon="edit"
                    className="btn--outline"
                    onClick={openEditCustomerModal}
                    ref={openEditCustomerModalBtn}
                >
                    Éditer
                </Button>
                <Button
                    icon="trash"
                    className="btn--outline-danger"
                    onClick={openDeleteCustomerModal}
                    ref={openDeleteCustomerModalBtn}
                >
                    Supprimer
                </Button>
            </> || <p>Chargement...</p>}
         </div>

        <div className="customerDetails__selectBar">
            {invoices && <>
                <p><strong>{invoices.length}</strong> factures associées.</p>
                <form>
                    <SelectInput
                        error={undefined}
                        options={selectDataTypeOptions}
                        {...register("dataType")}
                    />
                </form>
                <Button icon="filter" className="btn--outline">Filtrer</Button>
                <Button icon="invoice" className="btn--secondary-accent">Exporter les devis</Button>
                <Button icon="invoice" className="btn--secondary">Exporter les factures</Button>
            </> || <p>Chargement...</p>}
        </div>
        
        <div className="customerDetails__tableData">
                {watch("dataType") === "INVOICES" && <> 
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Chrono</th>
                                    <th>Montant total (HT)</th>
                                    <th>Statut</th>
                                    <th>Prestation réalisée</th>
                                    <th>Date d&lsquo;envoi</th>
                                    <th>Date de paiement</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((invoice: Invoice, index: number) => (
                                    <tr key={index}>
                                        <td><Link to={`/factures/${invoice.id}`}>{invoice.chrono}</Link></td>
                                        <td>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(invoice.totalAmount)}</td>
                                        <td><Badge status={invoice.status} /></td>
                                        <td>-</td>
                                        <td>{invoice.sentAt && dayjs(invoice.sentAt).fromNow() || "-"}</td>
                                        <td>{invoice.paidAt && dayjs(invoice.paidAt).fromNow() || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                </>}
        </div>
    </div>
}