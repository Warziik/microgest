import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/Button";
import Icon from "../../components/Icon";
import { useAuth } from "../../hooks/useAuth";
import { fetchAllCustomers } from "../../services/CustomerService";
import { Customer } from "../../types/Customer";
import { Modal } from "../../components/Modal";
import { AddEditCustomerForm } from "./AddEditCustomerForm";
import dayjs from "dayjs";
import { Collection } from "../../types/Collection";

export function Customers() {
    const { userData } = useAuth();
    const [customers, setCustomers] = useState<Customer[]>([]);

    const [showAddEditCustomerModal, setShowAddEditCustomerModal] = useState(false);
    const [customerToEdit, setCustomerToEdit] = useState<Customer>();
    
    const addCustomerBtnRef = useRef<HTMLButtonElement>(null);
    const editCustomerBtnRefs = useRef<HTMLButtonElement[]>([]);
    const [activeEditCustomerBtnIndex, setActiveEditCustomerBtnIndex] = useState(0);

    useEffect(() => {
        document.title = "Mes clients - Microgest";
    }, [])

    useEffect(() => {
        fetchAllCustomers(userData.id)
            .then((values: [boolean, Collection<Customer>]) => {
                const [isSuccess, data] = values;
                if (isSuccess) setCustomers(data["hydra:member"]);
            });
    }, [userData.id]);

    const addCustomer = (customer: Customer) => setCustomers([...customers, customer]);

    const editCustomer = (updatedCustomer: Customer) => {
        const index = customers.findIndex((customer: Customer) => customer.id === updatedCustomer.id);
        const newCustomers = [...customers];
        newCustomers[index] = updatedCustomer;
        setCustomers(newCustomers);
    }

    const openAddCustomerModal = () => setShowAddEditCustomerModal(true);

    const openEditCustomerModal = (customer: Customer, index: number) => {
        setActiveEditCustomerBtnIndex(index);
        setCustomerToEdit(customer);
        setShowAddEditCustomerModal(true);
    }

    const closeAddEditCustomerModal = () => {
        setShowAddEditCustomerModal(false);
        if (customerToEdit) {
            editCustomerBtnRefs.current[activeEditCustomerBtnIndex].focus();
        } else {
            addCustomerBtnRef.current?.focus();
        }
    }

    const handleFilterBtn = () => console.log("handle filter btn clicked.");

    return <div className="customers">
        <Modal
            isOpen={showAddEditCustomerModal}
            onClose={closeAddEditCustomerModal}
            title={customerToEdit ? "Éditer le client" : "Ajouter un client"}
            className="addCustomerModal"
        >
            {customerToEdit && <AddEditCustomerForm customerToEdit={customerToEdit} changeCustomer={editCustomer} />}
            {!customerToEdit && <AddEditCustomerForm changeCustomer={addCustomer} />}
        </Modal>
        <div className="customers__ctas">
            <Button icon="add" onClick={openAddCustomerModal} ref={addCustomerBtnRef}>Ajouter un client</Button>
            <Button className="btn--outline" icon="filter" onClick={handleFilterBtn}>Filtrer</Button>
            {/* TODO: Pagination */}
        </div>
        <div className="customers__list">
            {customers.map((customer: Customer, index: number) => (
                <article className="customers__item" key={customer.id}>
                    <header className="customers__item-header">
                        <img src="https://via.placeholder.com/72" alt={`${customer.firstname} ${customer.lastname}'s picture.`} />
                        <h2>{customer.firstname} {customer.lastname}</h2>
                        <p>Ajouté {dayjs(customer.createdAt).fromNow()}</p>
                    </header>
                    <div className="customers__item-main">
                        <div className="customers__item-main-data">
                            <p><strong>Adresse email:</strong> {customer.email}</p>
                        </div>
                        <div className="customers__item-main-data">
                            <p><strong>Numéro SIRET:</strong> {customer.company || `-`}</p>
                        </div>
                        <div className="customers__item-main-data">
                            <p><strong>Numéro de téléphone:</strong> -</p>
                        </div>
                        <div className="customers__item-main-data">
                            <p><strong>Dernière facture:</strong></p> 
                            {customer.lastInvoice && <>
                                <Link to="/">{customer.lastInvoice.chrono}</Link>
                            </> || "-"}
                        </div>
                    </div>
                    <footer className="customers__item-footer">
                        <Button ref={(el: HTMLButtonElement) => editCustomerBtnRefs.current.push(el)} className="btn--secondary-small" icon="edit" onClick={() => openEditCustomerModal(customer, index)}>Éditer</Button>
                        <Link to={`/clients/${customer.id}`} className="customers__item-footer-seeMore">
                            Voir plus
                            <Icon name="arrow-left" />
                        </Link>
                    </footer>
                </article>
            )) || <p>Vous n&lsquo;avez ajouté aucun client pour le moment.</p>}
        </div>
    </div>
}