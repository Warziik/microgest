import React from "react";

export function LastYearsComparison() {
    return <div className="overview__lastYearsComparison">
        <h2>Comparatif des dernières années</h2>
        <div className="overview__lastYearsComparison-list">
            <p className="unaivalable-message">
                Indisponible pour le moment.
            </p>
            {/*
            {[1, 2, 3].map((index: number) =>
                <div key={index} className="overview__lastYearsComparison-list-item">
                    <h4>{2021 - index}</h4>
                    <p className="overview__lastYearsComparison-list-item-description">
                        <strong>+12%</strong> depuis l'année précédente.</p>
                    <p className="overview__lastYearsComparison-list-item-amount">38,159.00€</p>
                    <div className="overview__lastYearsComparison-list-item-smallChart"></div>
                </div>
            )}
            */}
        </div>
    </div>
}