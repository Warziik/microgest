import React, {useCallback, useEffect, useState} from "react";
import {Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis} from "recharts";
import {fetchTurnoverEvolutionDataChart} from "../../services/ChartService";
import dayjs from "dayjs";
import {Invoice} from "../../types/Invoice";

type ChartData = {
    month: string;
    amount: number;
    variation?: string;
}

export function TurnoverEvolution() {
    const [chartData, setChartData] = useState<any[]>();

    const fetchChartData = useCallback(async () => {
        const [isSuccess, data] = await fetchTurnoverEvolutionDataChart();

        if (isSuccess) {
            const dataToSet: ChartData[] = [];
            for (let i = 0; i <= dayjs().get("M"); i++) {
                const invoicesOfTheMonth = data["hydra:member"].filter((invoice: Invoice) => {
                    return dayjs(invoice.paidAt).get("month") === (i + 1)
                });
                let amount = 0;
                invoicesOfTheMonth.forEach((invoice: Invoice) => {
                    amount += invoice.totalAmount;
                });
                dataToSet.push({
                    month: dayjs.months()[i],
                    amount,
                    variation: "" // TODO
                });
            }
            setChartData(dataToSet);
        }
    }, []);

    useEffect(() => {
        fetchChartData();
    }, [fetchChartData]);

    return <div className="overview__turnoverEvolution">
        <h2>Évolution de votre chiffre d&lsquo;affaire</h2>
        {chartData && <ResponsiveContainer width="100%" height="95%">
            <AreaChart margin={{top: 0, left: 0, right: 0, bottom: 0}} data={chartData}>
                <defs>
                    <linearGradient id="linearChart" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary-color-a1)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--primary-color-a1)" stopOpacity={0.1}/>
                    </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border-color)" vertical={false}/>
                <YAxis
                    interval="preserveEnd"
                    tick={{fill: "var(--text-color-alt)"}}
                    axisLine={false}
                    tickLine={false}
                    tickCount={10}
                    tickFormatter={(number: number) => `${number}`}
                />
                <XAxis
                    interval="preserveStartEnd"
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(tickItem: string) => tickItem.substr(0, 4)}
                    tick={{fill: "var(--text-color-alt)"}}
                />
                <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="var(--primary-color)"
                    strokeWidth={1}
                    fillOpacity={1}
                    fill="url(#linearChart)"
                />
                <Tooltip content={<CustomChartTooltip/>}/>
            </AreaChart>
        </ResponsiveContainer>}
    </div>
}

function CustomChartTooltip({active, payload, label}: any) {
    if (active && payload && payload.length) {
        return (
            <div className="chartCustomTooltip">
                <p className="chartCustomTooltip__date">{label}</p>
                <p className="chartCustomTooltip__amount">{new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                }).format(payload[0].value)}</p>
                <p
                    className={`
                    chartCustomTooltip__variation
                    chartCustomTooltip__variation--${payload[0].payload.variation.startsWith("+") ? "positive" : "negative"}
                    `}>
                    {payload[0].payload.variation}
                </p>
            </div>
        );
    }

    return null;
}