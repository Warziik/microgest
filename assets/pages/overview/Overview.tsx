import React, {useEffect} from "react";
import {TurnoverEvolution} from "./TurnoverEvolution";
import {ExportDocuments} from "./ExportDocuments";
import {LastAddedDocuments} from "./LastAddedDocuments";
import {LastYearsComparison} from "./LastYearsComparison";

export function Overview() {
    useEffect(() => {
        document.title = "Vue d'ensemble - Microgest";
    }, []);

    return (
        <div className="overview">
            <TurnoverEvolution/>
            <LastYearsComparison/>
            <ExportDocuments/>
            <LastAddedDocuments/>
        </div>
    );
}
