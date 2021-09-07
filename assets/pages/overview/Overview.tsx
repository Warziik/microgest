import React, {useEffect} from "react";
import {TurnoverEvolution} from "./TurnoverEvolution";
import {LastAddedDocuments} from "./LastAddedDocuments";

export function Overview() {
    useEffect(() => {
        document.title = "Vue d'ensemble - Microgest";
    }, []);

    return (
        <div className="overview">
            <TurnoverEvolution/>
            {/*
            <LastYearsComparison/>
            <ExportDocuments/>
            */}
            <LastAddedDocuments/>
        </div>
    );
}
