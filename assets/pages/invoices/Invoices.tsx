import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../../components/Badge";
import { useAuth } from "../../hooks/useAuth";
import { Invoice } from "../../types/Invoice";
import { fetchAllInvoicesOfUser } from "../../services/InvoiceService";
import dayjs from "dayjs";

export function Invoices() {
    const { userData } = useAuth();
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    useEffect(() => {
        document.title = "Mes factures - Microgest";
    }, [])

    useEffect(() => {
        fetchAllInvoicesOfUser(userData.id)
            .then((values: [boolean, Invoice | any]) => {
                const [isSuccess, data] = values;
                if (isSuccess) setInvoices(data["allInvoices"]);
            });
    }, [userData.id]);

    return <div className="invoices">
        <div className="invoices__list">
            <table className="table">
                <thead>
                    <tr>
                        <th>Chrono</th>
                        <th>Montant (€)</th>
                        <th>Statut</th>
                        <th>Client</th>
                        <th>Date d&lsquo;envoi</th>
                        <th>Date de paiement</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice: Invoice, index: number) => (
                        <tr key={index}>
                            <td><Link to={`/factures/${invoice.id}`}>{invoice.chrono}</Link></td>
                            <td>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(invoice.amount)}</td>
                            <td><Badge status={invoice.status} /></td>
                            <td><Link to={`/clients/${invoice.customer.id}`}>{invoice.customer.firstname} {invoice.customer.lastname}</Link></td>
                            <td>{invoice.sentAt && dayjs(invoice.sentAt).fromNow() || "-"}</td>
                            <td>{invoice.paidAt && dayjs(invoice.paidAt).fromNow() || "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
}