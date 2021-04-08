import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/Button";
import Icon from "../../components/Icon";
import { useAuth } from "../../hooks/useAuth";
import { fetchAllCustomers } from "../../services/CustomerService";
import { Customer } from "../../types/Customer";
import { Badge } from "../../components/Badge";

import dayjs from "dayjs";

export function Customers() {
    const { userData } = useAuth();
    const [customers, setCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        document.title = "Mes clients - Microgest";
    }, [])

    useEffect(() => {
        fetchAllCustomers(userData.id)
            .then((values: any) => {
                const [isSuccess, data] = values;

                if (isSuccess) setCustomers(data["hydra:member"]);
            });
    }, [userData.id]);

    const getBadgeOptions = (type: string): any => {
        switch (type) {
            case "NEW":
                return ["info", "Nouveau"];
            case "SENT":
                return ["warning", "Envoyé"];
            case "PAID":
                return ["success", "Payé"];
            case "CANCELLED":
                return ["error", "Annulé"];
            default:
                return [];
        }
    }

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
                <article className="customers__item" key={customer.id}>
                    <header className="customers__item-header">
                        <img src="https://via.placeholder.com/72" alt={`${customer.firstname} ${customer.lastname}'s picture.`} />
                        <h2>{customer.firstname} {customer.lastname}</h2>
                        <p>{customer.email}</p>
                    </header>
                    <div className="customers__item-main">
                        <div className="customers__item-main-addedDate">
                            <h4>Date d&lsquo;ajout</h4>
                            <p>{dayjs(customer.createdAt).fromNow()}</p>
                        </div>
                        <div className="customers__item-main-company">
                            <h4>Entreprise</h4>
                            <p>{customer.company || `Non spécifiée`}</p>
                        </div>
                        <div className="customers__item-main-lastInvoice">
                            <h4>Dernière facture</h4>
                            {customer.lastInvoice && <>
                                <Link to="/">{customer.lastInvoice.chrono}</Link>
                                <Badge type={getBadgeOptions(customer.lastInvoice.status)[0]} message={getBadgeOptions(customer.lastInvoice.status)[1]} />
                            </> || "-"}
                        </div>
                    </div>
                    <footer className="customers__item-footer">
                        <Button className="btn--tertiary-small" icon="edit" onClick={handleEditBtn}>Éditer</Button>
                        <Link to="/clients" className="customers__item-footer-seeMore">
                            Voir plus
                            <Icon name="double-chevron-right" />
                        </Link>
                    </footer>
                </article>
            )) || <p>Vous n&lsquo;avez ajouté aucun client pour le moment.</p>}
        </main>
    </section>
}