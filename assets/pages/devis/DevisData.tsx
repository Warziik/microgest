import React, {useEffect, useRef, useState} from "react";
import {Tabs} from "../../components/tab/Tabs";
import {Tab} from "../../components/tab/Tab";
import {Link, useHistory, useLocation} from "react-router-dom";
import {Badge} from "../../components/Badge";
import {Devis} from "../../types/Devis";
import {Button} from "../../components/Button";
import dayjs from "dayjs";
import {Icon} from "../../components/Icon";
import {useAuth} from "../../hooks/useAuth";
import {Controller, useForm} from "react-hook-form";
import {Option, SelectInput} from "../../components/form/SelectInput";

type Props = {
    devis: Devis[];
    displayCustomer?: boolean;
    displayUrls?: boolean;
};

type MonthlyDevis = {
    monthId: number;
    devis: Devis[];
};

export function DevisData({
                              devis,
                              displayCustomer = false,
                              displayUrls = false,
                          }: Props) {
    const {push} = useHistory();
    const {pathname} = useLocation();
    const {userData} = useAuth();

    const [allDevis, setAllDevis] = useState<Record<string, MonthlyDevis[]>>();
    const [sortableTypeReverse, setSortableTypeReverse] = useState<Record<string, boolean>>({});
    const [selectYearOptions, setSelectYearOptions] = useState<Option[]>([]);

    const [expiredDevis, setExpiredDevis] = useState<Devis[]>();
    const [draftDevis, setDraftDevis] = useState<Devis[]>();

    const allDevisRef = useRef(null);
    const expiredRef = useRef(null);
    const draftsRef = useRef(null);

    const {control, watch} = useForm<{
        year: Option;
    }>({
        mode: "onChange",
        defaultValues: {year: {value: dayjs().get("y"), label: dayjs().get("y").toString()}},
    });

    const getDefaultTab = () => {
        switch (pathname) {
            case "/devis":
                return 0;
            case "/devis/expirés":
                return 1;
            case "/devis/brouillons":
                return 2;
        }
    };

    useEffect(() => {
        setExpiredDevis(
            devis.filter(
                (devis: Devis) =>
                    devis.validityDate.slice(0, 19) <
                    new Date().toISOString().slice(0, 19)
            )
        );
        setDraftDevis(devis.filter((devis: Devis) => devis.isDraft === true));

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

        const totalDevis: Record<string, MonthlyDevis[]> = {};
        for (let yearI = 0; yearI < years.length; yearI++) {
            totalDevis[years[yearI]] = [];

            for (let i = 0; i < 12; i++) {
                if (years[yearI] === dayjs().get("y") && dayjs().get("M") + 1 === i) {
                    break;
                }

                totalDevis[years[yearI]].push({
                    monthId: i,
                    devis: devis.filter(
                        (devis: Devis) =>
                            parseInt(devis.createdAt.slice(5, 7)) - 1 === i &&
                            parseInt(devis.createdAt.slice(0, 4)) === years[yearI]
                    ),
                });
            }
            totalDevis[years[yearI]].reverse();
        }

        setAllDevis(totalDevis);
    }, [devis]);

    const handleSort = () => {
        if (allDevis) {
            setAllDevis({
                ...allDevis,
                [watch("year").value]: allDevis[watch("year").value].reverse(),
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
                title={"Tous les devis"}
                url={displayUrls ? "/devis" : undefined}
                tabRef={allDevisRef}
            >
                <>
                    {allDevis && (
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
                            {allDevis[watch("year").value].map(
                                (object: MonthlyDevis, index: number) => (
                                    <div key={index} className="invoices__list">
                                        <div className="invoices__list-header">
                                            <h3>{dayjs.months()[object.monthId]}</h3>
                                            <p>
                                                <strong>{object.devis.length}</strong>
                                                &nbsp;devis émis
                                            </p>
                                        </div>
                                        {object.devis.length > 0 && (
                                            <table className="table">
                                                <thead>
                                                <tr>
                                                    <th>Jour</th>
                                                    <th>Chrono</th>
                                                    <th>Statut</th>
                                                    {displayCustomer && <th>Client</th>}
                                                    <th>Date de création</th>
                                                    <th>Date d&lsquo;expiration</th>
                                                    <th>Date de début de la prestation</th>
                                                    <th>Actions</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {object.devis.map((devis: Devis, index: number) => (
                                                    <tr key={index}>
                                                        <td data-label="Jour">
                                                            {dayjs(devis.createdAt).format("DD")}
                                                        </td>
                                                        <td data-label="Chrono">
                                                            <Link
                                                                className="link"
                                                                to={`/devis-détails/${devis.id}`}
                                                            >
                                                                {devis.chrono}
                                                            </Link>
                                                        </td>
                                                        <td data-label="Statut">
                                                            <Badge status={devis.status}/>
                                                        </td>
                                                        {displayCustomer && (
                                                            <td data-label="Client">
                                                                <Link
                                                                    className="link"
                                                                    to={`/client/${devis.customer.id}`}
                                                                >
                                                                    {devis.customer.type === "PERSON"
                                                                        ? `${devis.customer.firstname} ${devis.customer.lastname}`
                                                                        : devis.customer.company}
                                                                </Link>
                                                            </td>
                                                        )}
                                                        <td data-label="Date de création">
                                                            {dayjs(devis.createdAt).fromNow()}
                                                        </td>
                                                        <td data-label="Date d&lsquo;expiration">
                                                            {dayjs(devis.validityDate).fromNow()}
                                                        </td>
                                                        <td data-label="Date de début de la prestation">
                                                            {dayjs(devis.workStartDate).format(
                                                                "dddd DD MMMM YYYY"
                                                            )}
                                                        </td>
                                                        <td data-label="Actions">
                                                            {(!devis.isDraft && (
                                                                <Button
                                                                    type="contrast"
                                                                    size="small"
                                                                    onClick={() =>
                                                                        push(`/devis-détails/${devis.id}/export`)
                                                                    }
                                                                >
                                                                    Exporter
                                                                </Button>
                                                            )) ||
                                                            "-"}
                                                        </td>
                                                    </tr>
                                                ))}
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
                title={"Expirés"}
                url={displayUrls ? "/devis/expirés" : undefined}
                tabRef={expiredRef}
            >
                <div className="invoices__list">
                    {expiredDevis && expiredDevis.length > 0 && (
                        <>
                            <div className="invoices__list-header">
                                <h3>Devis expirés</h3>
                                <p>
                                    <strong>{expiredDevis.length}</strong>
                                    &nbsp;devis&nbsp;
                                    {expiredDevis.length <= 1 ? "expiré" : "expirés"}
                                </p>
                            </div>
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Chrono</th>
                                    <th>Statut</th>
                                    {displayCustomer && <th>Client</th>}
                                    <th>Date de création</th>
                                    <th>Date d&lsquo;expiration</th>
                                    <th>Date de début de la prestation</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {expiredDevis.map((devis: Devis, index: number) => (
                                    <tr key={index}>
                                        <td data-label="Chrono">
                                            <Link
                                                className="link"
                                                to={`/devis-détails/${devis.id}`}
                                            >
                                                {devis.chrono}
                                            </Link>
                                        </td>
                                        <td data-label="Statut">
                                            <Badge status={devis.status}/>
                                        </td>
                                        {displayCustomer && (
                                            <td data-label="Client">
                                                <Link
                                                    className="link"
                                                    to={`/client/${devis.customer.id}`}
                                                >
                                                    {devis.customer.type === "PERSON"
                                                        ? `${devis.customer.firstname} ${devis.customer.lastname}`
                                                        : devis.customer.company}
                                                </Link>
                                            </td>
                                        )}
                                        <td data-label="Date de création">
                                            {dayjs(devis.createdAt).fromNow()}
                                        </td>
                                        <td data-label="Date d&lsquo;expiration">
                                            {dayjs(devis.validityDate).fromNow()}
                                        </td>
                                        <td data-label="Date de début de la prestation">
                                            {dayjs(devis.workStartDate).format("dddd DD MMMM YYYY")}
                                        </td>
                                        <td data-label="Actions">
                                            <Button
                                                type="contrast"
                                                size="small"
                                                onClick={() =>
                                                    push(`/devis-détails/${devis.id}/export`)
                                                }
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
                    {expiredDevis?.length === 0 && (
                        <p>Aucun devis expiré pour le moment.</p>
                    )}
                </div>
            </Tab>
            <Tab
                title={"Brouillons"}
                url={displayUrls ? "/devis/brouillons" : undefined}
                tabRef={draftsRef}
            >
                <div className="invoices__list">
                    {draftDevis && draftDevis.length > 0 && (
                        <>
                            <div className="invoices__list-header">
                                <h3>Devis brouillons</h3>
                                <p>
                                    <strong>{draftDevis.length}</strong>
                                    &nbsp;devis&nbsp;
                                    {draftDevis.length === 1 ? "brouillon" : "brouillons"}
                                </p>
                            </div>
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Chrono</th>
                                    <th>Statut</th>
                                    {displayCustomer && <th>Client</th>}
                                    <th>Date de création</th>
                                    <th>Date d&lsquo;expiration</th>
                                    <th>Date de début de la prestation</th>
                                </tr>
                                </thead>
                                <tbody>
                                {draftDevis.map((devis: Devis, index: number) => (
                                    <tr key={index}>
                                        <td data-label="Chrono">
                                            <Link
                                                className="link"
                                                to={`/devis-détails/${devis.id}`}
                                            >
                                                {devis.chrono}
                                            </Link>
                                        </td>
                                        <td data-label="Statut">
                                            <Badge status={devis.status}/>
                                        </td>
                                        {displayCustomer && (
                                            <td data-label="Client">
                                                <Link
                                                    className="link"
                                                    to={`/client/${devis.customer.id}`}
                                                >
                                                    {devis.customer.type === "PERSON"
                                                        ? `${devis.customer.firstname} ${devis.customer.lastname}`
                                                        : devis.customer.company}
                                                </Link>
                                            </td>
                                        )}
                                        <td data-label="Date de création">
                                            {dayjs(devis.createdAt).fromNow()}
                                        </td>
                                        <td data-label="Date d&lsquo;expiration">
                                            {dayjs(devis.validityDate).fromNow()}
                                        </td>
                                        <td data-label="Date de début de la prestation">
                                            {dayjs(devis.workStartDate).format("dddd DD MMMM YYYY")}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </>
                    )}
                    {draftDevis && draftDevis.length === 0 && (
                        <p>Aucune devis brouillon pour le moment.</p>
                    )}
                    {!draftDevis && <p>Chargement...</p>}
                </div>
            </Tab>
        </Tabs>
    );
}
