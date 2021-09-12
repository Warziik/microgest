import React, {useRef, useEffect} from "react";
import {Tabs} from "../../components/tab/Tabs";
import {Tab} from "../../components/tab/Tab";
import {Invoice} from "../../types/Invoice";
import {Link, useHistory, useLocation} from "react-router-dom";
import {Badge} from "../../components/Badge";
import {Button} from "../../components/Button";
import dayjs from "dayjs";
import {useState} from "react";
import {Icon} from "../../components/Icon";
import {Controller, useForm} from "react-hook-form";
import {Option, SelectInput} from "../../components/form/SelectInput";
import {useAuth} from "../../hooks/useAuth";

type Props = {
    invoices: Invoice[];
    displayCustomer?: boolean;
    displayUrls?: boolean;
};

type MonthlyInvoices = {
    monthId: number;
    invoices: Invoice[];
};

export function InvoicesData({invoices, displayCustomer = false, displayUrls = false}: Props) {
    const {pathname} = useLocation();
    const {push} = useHistory();
    const {userData} = useAuth();

    const [allInvoices, setAllInvoices] =
        useState<Record<string, MonthlyInvoices[]>>();
    const [sortableTypeReverse, setSortableTypeReverse] = useState<Record<string, boolean>>({});
    const [selectYearOptions, setSelectYearOptions] = useState<Option[]>([]);

    const [unpaidInvoices, setUnpaidInvoices] = useState<Invoice[]>();
    const [draftInvoices, setDraftInvoices] = useState<Invoice[]>();

    const allInvoicesRef = useRef(null);
    const unpaidRef = useRef(null);
    const draftsRef = useRef(null);

    const {control, watch} = useForm<{
        year: Option;
    }>({
        mode: "onChange",
        defaultValues: {year: {value: dayjs().get("y"), label: dayjs().get("y").toString()}},
    });

    const getDefaultTab = () => {
        switch (pathname) {
            case "/factures":
                return 0;
            case "/factures/impayées":
                return 1;
            case "/factures/brouillons":
                return 2;
        }
    };

    useEffect(() => {
        setUnpaidInvoices(
            invoices.filter(
                (invoice: Invoice) =>
                    invoice.paymentDeadline.slice(0, 19) <
                    new Date().toISOString().slice(0, 19) && !invoice.isDraft
            )
        );
        setDraftInvoices(
            invoices.filter((invoice: Invoice) => invoice.isDraft === true)
        );

        const years: number[] = [dayjs().get("y")];
        for (let i = 0; i < dayjs().diff(userData.createdAt, "y"); i++) {
            years.push(dayjs().get("y") - (i + 1));
        }
        setSelectYearOptions(
            years.map((value: number) => {
                return {value, label: value.toString()};
            })
        );

        const initialSortableTypes: Record<number, boolean> = {};
        years.forEach((value: number) => {
            initialSortableTypes[value] = true;
        });
        setSortableTypeReverse(initialSortableTypes);

        const totalInvoices: Record<string, MonthlyInvoices[]> = {};
        for (let yearI = 0; yearI < years.length; yearI++) {
            totalInvoices[years[yearI]] = [];

            for (let i = 0; i < 12; i++) {
                if (years[yearI] === dayjs().get("y") && dayjs().get("M") + 1 === i) {
                    break;
                }

                totalInvoices[years[yearI]].push({
                    monthId: i,
                    invoices: invoices.filter(
                        (invoice: Invoice) =>
                            parseInt(invoice.createdAt.slice(5, 7)) - 1 === i &&
                            parseInt(invoice.createdAt.slice(0, 4)) === years[yearI]
                    ),
                });
            }
            totalInvoices[years[yearI]].reverse();
        }

        setAllInvoices(totalInvoices);
    }, [invoices]);

    const handleSort = () => {
        if (allInvoices) {
            setAllInvoices({
                ...allInvoices,
                [watch("year").value]: allInvoices[watch("year").value].reverse(),
            });
            setSortableTypeReverse({
                ...sortableTypeReverse,
                [watch("year").value]: !sortableTypeReverse[watch("year").value],
            });
        }
    };

    return (
        <Tabs defaultActiveTab={displayUrls ? getDefaultTab() : 0}>
            <Tab
                title={"Toutes les factures"}
                url={displayUrls ? "/factures" : undefined}
                tabRef={allInvoicesRef}
            >
                <>
                    {allInvoices && (
                        <>
                            <div className="sorting-ctas">
                                <form>
                                    <Controller
                                        name="year"
                                        control={control}
                                        render={({field}) => (
                                            <SelectInput
                                                options={selectYearOptions}
                                                isSearchable={false}
                                                className="customFormSelectSmall"
                                                {...field}
                                            />
                                        )}
                                    />
                                </form>
                                <button onClick={handleSort}>
                                    <Icon name="filter"/>
                                    Trier par ordre&nbsp;
                                    {sortableTypeReverse[watch("year").value]
                                        ? "croissant"
                                        : "décroissant"}
                                </button>
                            </div>
                            {allInvoices[watch("year").value].map(
                                (object: MonthlyInvoices, index: number) => (
                                    <div key={index} className="invoices__list">
                                        <div className="invoices__list-header">
                                            <h3>{dayjs.months()[object.monthId]}</h3>
                                            <p>
                                                <strong>{object.invoices.length}</strong>
                                                &nbsp;
                                                {object.invoices.length <= 1
                                                    ? "facture émise"
                                                    : "factures émises"}
                                            </p>
                                        </div>

                                        {object.invoices.length > 0 && (
                                            <table className="table">
                                                <thead>
                                                <tr>
                                                    <th>Jour</th>
                                                    <th>Chrono</th>
                                                    <th>Statut</th>
                                                    {displayCustomer && <th>Client</th>}
                                                    <th>Montant total (TTC)</th>
                                                    <th>Date d&lsquo;exécution</th>
                                                    <th>Date limite de paiement</th>
                                                    <th>Actions</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {object.invoices.map(
                                                    (invoice: Invoice, index: number) => (
                                                        <tr key={index}>
                                                            <td data-label="Jour">
                                                                {dayjs(invoice.createdAt).format("DD")}
                                                            </td>
                                                            <td data-label="Chrono">
                                                                <Link
                                                                    className="link"
                                                                    to={`/facture/${invoice.id}`}
                                                                >
                                                                    {invoice.chrono}
                                                                </Link>
                                                            </td>
                                                            <td data-label="Statut">
                                                                <Badge status={invoice.status}/>
                                                            </td>
                                                            {displayCustomer && (
                                                                <td data-label="Client">
                                                                    <Link
                                                                        className="link"
                                                                        to={`/client/${invoice.customer.id}`}
                                                                    >
                                                                        {invoice.customer.type === "PERSON"
                                                                            ? `${invoice.customer.firstname} ${invoice.customer.lastname}`
                                                                            : invoice.customer.company}
                                                                    </Link>
                                                                </td>
                                                            )}
                                                            <td data-label="Montant total (TTC)">
                                                                {new Intl.NumberFormat("fr-FR", {
                                                                    style: "currency",
                                                                    currency: "EUR",
                                                                }).format(
                                                                    invoice.tvaApplicable
                                                                        ? invoice.totalAmount + (invoice.totalAmount * 20) / 100
                                                                        : invoice.totalAmount
                                                                )}
                                                            </td>
                                                            <td data-label="Date d&lsquo;exécution">
                                                                {dayjs(invoice.serviceDoneAt).fromNow()}
                                                            </td>
                                                            <td data-label="Date limite de paiement">
                                                                {dayjs(invoice.paymentDeadline).format(
                                                                    "dddd DD MMMM YYYY"
                                                                )}
                                                            </td>
                                                            <td data-label="Actions">
                                                                {(!invoice.isDraft && (
                                                                    <Button
                                                                        type="contrast"
                                                                        size="small"
                                                                        onClick={() =>
                                                                            push(`/facture/${invoice.id}/export`)
                                                                        }
                                                                    >
                                                                        Exporter
                                                                    </Button>
                                                                )) ||
                                                                "-"}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                )
                            )}
                        </>
                    )}
                </>
            </Tab>
            <Tab
                title={"Impayées"}
                url={displayUrls ? "/factures/impayées" : undefined}
                tabRef={unpaidRef}
            >
                <div className="invoices__list">
                    {unpaidInvoices && unpaidInvoices.length > 0 && (
                        <>
                            <div className="invoices__list-header">
                                <h3>Factures impayées</h3>
                                <p>
                                    <strong>{unpaidInvoices.length}</strong>
                                    &nbsp;
                                    {unpaidInvoices.length === 1
                                        ? "facture impayée"
                                        : "factures impayées"}
                                </p>
                            </div>
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Chrono</th>
                                    <th>Statut</th>
                                    {displayCustomer && <th>Client</th>}
                                    <th>Montant total (TTC)</th>
                                    <th>Date limite de paiement</th>
                                    <th>Taux de pénalité dû au retard</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {unpaidInvoices.map((invoice: Invoice, index: number) => (
                                    <tr key={index}>
                                        <td data-label="Chrono">
                                            <Link className="link" to={`/facture/${invoice.id}`}>
                                                {invoice.chrono}
                                            </Link>
                                        </td>
                                        <td data-label="Statut">
                                            <Badge status={invoice.status}/>
                                        </td>
                                        {displayCustomer && (
                                            <td data-label="Client">
                                                <Link
                                                    className="link"
                                                    to={`/client/${invoice.customer.id}`}
                                                >
                                                    {invoice.customer.type === "PERSON"
                                                        ? `${invoice.customer.firstname} ${invoice.customer.lastname}`
                                                        : invoice.customer.company}
                                                </Link>
                                            </td>
                                        )}
                                        <td data-label="Montant total (TTC)">
                                            {new Intl.NumberFormat("fr-FR", {
                                                style: "currency",
                                                currency: "EUR",
                                            }).format(
                                                invoice.tvaApplicable
                                                    ? invoice.totalAmount + (invoice.totalAmount * 20) / 100
                                                    : invoice.totalAmount
                                            )}
                                        </td>
                                        <td data-label="Date limite de paiement">
                                            {dayjs(invoice.paymentDeadline).fromNow()}
                                        </td>
                                        <td data-label="Taux de pénalité dû au retard">
                                            {invoice.paymentDelayRate}% de la somme totale TTC
                                        </td>
                                        <td data-label="Actions">
                                            <Button
                                                type="contrast"
                                                size="small"
                                                onClick={() => push(`/facture/${invoice.id}/export`)}
                                            >
                                                Exporter
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </>
                    )}
                    {unpaidInvoices?.length === 0 && (
                        <p>Aucune facture impayée pour le moment.</p>
                    )}
                </div>
            </Tab>
            <Tab
                title={"Brouillons"}
                url={displayUrls ? "/factures/brouillons" : undefined}
                tabRef={draftsRef}
            >
                <div className="invoices__list">
                    {draftInvoices && draftInvoices.length > 0 && (
                        <>
                            <div className="invoices__list-header">
                                <h3>Factures brouillons</h3>
                                <p>
                                    <strong>{draftInvoices.length}</strong>
                                    &nbsp;
                                    {draftInvoices.length === 1
                                        ? "facture brouillon"
                                        : "factures brouillons"}
                                </p>
                            </div>
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Chrono</th>
                                    <th>Statut</th>
                                    {displayCustomer && <th>Client</th>}
                                    <th>Montant total (TTC)</th>
                                    <th>Date d&lsquo;exécution</th>
                                    <th>Date limite de paiement</th>
                                </tr>
                                </thead>
                                <tbody>
                                {draftInvoices.map((invoice: Invoice, index: number) => (
                                    <tr key={index}>
                                        <td data-label="Chrono">
                                            <Link className="link" to={`/facture/${invoice.id}`}>
                                                {invoice.chrono}
                                            </Link>
                                        </td>
                                        <td data-label="Statut">
                                            <Badge status={invoice.status}/>
                                        </td>
                                        {displayCustomer && (
                                            <td data-label="Client">
                                                <Link
                                                    className="link"
                                                    to={`/client/${invoice.customer.id}`}
                                                >
                                                    {invoice.customer.type === "PERSON"
                                                        ? `${invoice.customer.firstname} ${invoice.customer.lastname}`
                                                        : invoice.customer.company}
                                                </Link>
                                            </td>
                                        )}
                                        <td data-label="Montant total (TTC)">
                                            {new Intl.NumberFormat("fr-FR", {
                                                style: "currency",
                                                currency: "EUR",
                                            }).format(
                                                invoice.tvaApplicable
                                                    ? invoice.totalAmount + (invoice.totalAmount * 20) / 100
                                                    : invoice.totalAmount
                                            )}
                                        </td>
                                        <td data-label="Date d&lsquo;exécution">
                                            {dayjs(invoice.serviceDoneAt).fromNow()}
                                        </td>
                                        <td data-label="Date limite de paiement">
                                            {dayjs(invoice.paymentDeadline).format(
                                                "dddd DD MMMM YYYY"
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </>
                    )}
                    {draftInvoices && draftInvoices.length === 0 && (
                        <p>Aucune facture brouillon pour le moment.</p>
                    )}
                    {!draftInvoices && <p>Chargement...</p>}
                </div>
            </Tab>
        </Tabs>
    );
}
