import React, {useCallback, useEffect, useState} from "react";
import {Invoice} from "../../types/Invoice";
import {fetchLastAddedInvoices} from "../../services/InvoiceService";
import {fetchLastAddedDevis} from "../../services/DevisService";
import dayjs from "dayjs";
import {Link} from "react-router-dom";
import {Icon} from "../../components/Icon";
import {Option, SelectInput} from "../../components/form/SelectInput";
import {Controller, useForm} from "react-hook-form";
import {Devis} from "../../types/Devis";
import {LastAddedDocumentsSkeleton} from "../../components/skeletons/LastAddedDocumentsSkeleton";

export function LastAddedDocuments() {
    const [invoices, setInvoices] = useState<Invoice[]>();
    const [devis, setDevis] = useState<Devis[]>();
    const [globalData, setGlobalData] = useState<any[]>();

    const selectDataTypeOptions: Option[] = [
        {value: "ALL", label: "Afficher tous les documents"},
        {value: "INVOICES", label: "Uniquement les factures"},
        {value: "DEVIS", label: "Uniquement les devis"}
    ];

    const {control, watch} = useForm<{
        dataType: Option;
    }>({
        mode: "onChange",
        defaultValues: {dataType: {value: "ALL", label: "Afficher tous les documents"}},
    });

    const fetchData = useCallback(() => {
        fetchLastAddedInvoices()
            .then((values: any) => {
                const [isSuccess, dataInvoices] = values;
                if (isSuccess) {
                    setInvoices(dataInvoices["hydra:member"]);
                    fetchLastAddedDevis()
                        .then((values: any) => {
                            const [isSuccess, dataDevis] = values;
                            if (isSuccess) {
                                setDevis(dataDevis["hydra:member"]);
                                setGlobalData([...dataInvoices["hydra:member"], ...dataDevis["hydra:member"]]
                                    .sort((a: any, b: any) => {
                                        if (a.createdAt < b.createdAt) return 1;
                                        return 0;
                                    }));
                            }
                        });
                }
            });
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return <div className="overview__lastAddedDocuments">
        <div className="overview__lastAddedDocuments-fixedHeader">
            <h2>Derniers documents ajoutés</h2>
            <form>
                <Controller
                    name="dataType"
                    control={control}
                    render={({field}) => (
                        <SelectInput
                            options={selectDataTypeOptions}
                            {...field}
                            isSearchable={false}
                            className="customFormSelectSmall"
                        />
                    )}
                />
            </form>
        </div>
        <div className="overview__lastAddedDocuments-list">
            {globalData && <>
                {watch("dataType").value === "ALL" && globalData.map((data: Invoice | Devis, index: number) =>
                    <AddedDocument key={index} data={data}/>
                )}

                {watch("dataType").value === "INVOICES" && invoices && invoices.map((data: Invoice, index: number) =>
                    <AddedDocument key={index} data={data}/>
                )}

                {watch("dataType").value === "DEVIS" && devis && devis.map((data: Devis, index: number) =>
                    <AddedDocument key={index} data={data}/>
                )}
            </> || <LastAddedDocumentsSkeleton/>}
        </div>
    </div>
}

function AddedDocument({data}: { data: Invoice | Devis }) {
    return <div className="overview__lastAddedDocuments-list-item">
        <h4>{data["@type"] === "Invoice" ? `Facture n°` : `Devis n°`}{data.chrono}</h4>
        <p>Créé{data["@type"] === "Invoice" ? "e" : "".trim()} {dayjs(data.createdAt).fromNow()}</p>
        <Link
            className="btn-outline--primary--normal"
            to={data["@type"] === "Invoice" ? `/facture/${data.id}` : `/devis-détails/${data.id}`}>
            <Icon name="arrow-left"/>
        </Link>
        <Link
            className="btn-outline--primary--normal"
            to={data["@type"] === "Invoice" ? `/facture/${data.id}/export` : `/devis-détails/${data.id}/export`}>
            <Icon name="download"/>
        </Link>
    </div>
}