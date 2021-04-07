import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/Button";
import Icon from "../../components/Icon";
import { useAuth } from "../../hooks/useAuth";
import { fetchAllCustomers } from "../../services/CustomerService";
import { Customer } from "../../types/Customer";

import dayjs from "dayjs";

export function Customers() {
    const { userData } = useAuth();
    const [customers, setCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        fetchAllCustomers(userData.id)
            .then((values: any) => {
                const [isSuccess, data] = values;

                if (isSuccess) setCustomers(data["hydra:member"]);
            });
    }, [userData.id]);

    const handleAddCustomerBtn = () => {
        console.log("handle add customer btn clicked.");
    }

    const handleFilterBtn = () => {
        console.log("handle filter btn clicked.");
    }

    const handleEditBtn = () => {
        console.log("handle edit btn clicked.");
    }

    return <section className="customers">
        <div className="customers__ctas">
            <Button icon="add" onClick={handleAddCustomerBtn}>Ajouter un client</Button>
            <Button className="btn--secondary" icon="filter" onClick={handleFilterBtn}>Filtrer</Button>
            {/* TODO: Pagination */}
        </div>
        <main className="customers__list">
            {customers.map((customer: Customer) => (
                <div className="customers__item" key={customer.id}>
                    <div className="customers__item-details">
                        <img src="https://via.placeholder.com/72" alt={`${customer.firstname} ${customer.lastname}'s picture.`} />
                        <div className="customers__item-details-text">
                            <h2>{customer.firstname} {customer.lastname}</h2>
                            <p>Métier</p>
                        </div>
                    </div>
                    <div className="customers__item-addedDate">
                        <h4>Date d&lsquo;ajout</h4>
                        <p>{dayjs(customer.createdAt).fromNow()}</p>
                    </div>
                    <div className="customers__item-company">
                        <h4>Entreprise</h4>
                        <p>{customer.company || `Non spécifiée`}</p>
                    </div>
                    <div className="customers__item-lastInvoice">
                        <h4>Dernière facture</h4>
                        <p><Link to="/">0000-0000</Link> - Il y a X jours</p>
                    </div>
                    <div className="customers__item-ctas">
                        <Button className="btn--tertiary-small" icon="edit" onClick={handleEditBtn}>Éditer</Button>
                        <Link to="/clients" className="customers__item-seeMore">
                            Voir les détails
                        <Icon name="double-chevron-right" />
                        </Link>
                    </div>
                </div>
            )) || <p>Vous n&lsquo;avez ajouté aucun client pour le moment.</p>}
        </main>
    </section>
}