import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/Button";
import { Icon } from "../../components/Icon";
import { fetchAllCustomers } from "../../services/CustomerService";
import { Customer } from "../../types/Customer";
import { Modal } from "../../components/Modal";
import { AddEditCustomerForm } from "./AddEditCustomerForm";
import dayjs from "dayjs";
import { Collection } from "../../types/Collection";
import { CustoemrsSkeleton } from "../../components/skeletons/CustomersSkeleton";

export function Customers() {
  const [customers, setCustomers] = useState<Customer[]>();

  const [showAddEditCustomerModal, setShowAddEditCustomerModal] =
    useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer>();

  const addCustomerBtnRef = useRef<HTMLButtonElement>(null);
  const editCustomerBtnRefs = useRef<HTMLButtonElement[]>([]);
  const [activeEditCustomerBtnIndex, setActiveEditCustomerBtnIndex] =
    useState(0);

  useEffect(() => {
    document.title = "Mes clients - Microgest";
  }, []);

  useEffect(() => {
    fetchAllCustomers().then(
      (values: [boolean, Collection<Customer>]) => {
        const [isSuccess, data] = values;
        if (isSuccess) {
          setCustomers(data["hydra:member"]);
        }
      }
    );
  }, []);

  const addCustomer = (customer: Customer) => {
    if (customers) {
      setCustomers([...customers, customer]);
    }
  };

  const editCustomer = (updatedCustomer: Customer) => {
    if (customers) {
      const index = customers.findIndex(
        (customer: Customer) => customer.id === updatedCustomer.id
      );
      const newCustomers = [...customers];
      newCustomers[index] = updatedCustomer;
      setCustomers(newCustomers);
    }
  };

  const openAddCustomerModal = () => setShowAddEditCustomerModal(true);

  const openEditCustomerModal = (customer: Customer, index: number) => {
    setActiveEditCustomerBtnIndex(index);
    setCustomerToEdit(customer);
    setShowAddEditCustomerModal(true);
  };

  const closeAddEditCustomerModal = () => {
    setShowAddEditCustomerModal(false);
    if (customerToEdit) {
      editCustomerBtnRefs.current[activeEditCustomerBtnIndex].focus();
      setCustomerToEdit(undefined);
    } else {
      addCustomerBtnRef.current?.focus();
    }
  };

  return (
    <div className="customers">
      <Modal
        position="right"
        isOpen={showAddEditCustomerModal}
        onClose={closeAddEditCustomerModal}
        title={customerToEdit ? "Éditer le client" : "Nouveau client"}
        className="addCustomerModal"
      >
        {customerToEdit && (
          <AddEditCustomerForm
            customerToEdit={customerToEdit}
            changeCustomer={editCustomer}
          />
        )}
        {!customerToEdit && (
          <AddEditCustomerForm changeCustomer={addCustomer} />
        )}
      </Modal>
      <h1>Vos clients</h1>
      <div className="customers__header">
        <Button
          icon="user-plus"
          onClick={openAddCustomerModal}
          ref={addCustomerBtnRef}
        >
          Ajouter un nouveau client
        </Button>
        <Button type="outline" icon="filter" disabled={true}>
          Filtrer
        </Button>
        {/*         <div className="customers__pagination-wrapper">
          <p>
            <strong>8 clients</strong> affichés par page
          </p>
          <div className="pagination"></div>
        </div> */}
      </div>
      {!customers && <CustoemrsSkeleton />}
      <div className="customers__list">
        {customers &&
          customers.map((customer: Customer, index: number) => (
            <article className="customers__item" key={customer.id}>
              <header className="customers__item-header">
                <img
                  src={`${customer.pictureUrl ?? "/images/default.png"}`}
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
                <p>Ajouté {dayjs(customer.createdAt).fromNow()}</p>
              </header>
              <div className="customers__item-main">
                <div className="customers__item-main-data">
                  <p>Email</p>
                  <p>{customer.email}</p>
                </div>
                <div className="customers__item-main-data">
                  <p>Téléphone</p>
                  <p>{customer.phone || `-`}</p>
                </div>
                {customer.type === "COMPANY" && (
                  <div className="customers__item-main-data">
                    <p>Numéro SIRET</p>
                    <p>{customer.siret}</p>
                  </div>
                )}
                <div className="customers__item-main-data">
                  <p>Pays</p>
                  <p>{customer.country}</p>
                </div>
                <div className="customers__item-main-data">
                  <p>Dernière facture</p>
                  {(customer.lastInvoice && (
                    <p>
                      <Link to={`/facture/${customer.lastInvoice.id}`}>
                        {customer.lastInvoice.chrono}
                      </Link>
                    </p>
                  )) || <p>-</p>}
                </div>
              </div>
              <footer className="customers__item-footer">
                <Button
                  ref={(el: HTMLButtonElement) =>
                    editCustomerBtnRefs.current.push(el)
                  }
                  type="contrast"
                  size="small"
                  icon="edit"
                  onClick={() => openEditCustomerModal(customer, index)}
                >
                  Éditer
                </Button>
                <Link to={`/client/${customer.id}`} className="link-btn">
                  Voir plus
                  <Icon name="arrow-left" />
                </Link>
              </footer>
            </article>
          ))}
        {customers && customers.length === 0 && (
          <p>Aucun client pour le moment.</p>
        )}
      </div>
    </div>
  );
}
