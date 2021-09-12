import React, {useCallback, useEffect, useState} from "react";
import {
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    BarChart,
    Bar,
    LineChart,
    Line,
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis
} from "recharts";
import {fetchTurnoverEvolutionChartData} from "../../services/ChartService";
import dayjs from "dayjs";
import {Invoice} from "../../types/Invoice";
import {useForm, Controller} from "react-hook-form";
import {Option, SelectInput} from "../../components/form/SelectInput";

type ChartData = {
    month: string;
    amount: number;
    variation: string;
}

export function TurnoverEvolution() {
    const [chartData, setChartData] = useState<ChartData[]>();

    const fetchChartData = useCallback(async () => {
        const [isSuccess, data] = await fetchTurnoverEvolutionChartData();

        if (isSuccess) {
            const dataToSet: ChartData[] = [];
            for (let i = 0; i <= dayjs().get("M"); i++) {
                const invoicesOfTheMonth = data["hydra:member"].filter((invoice: Invoice) => {
                    return parseInt(dayjs.utc(invoice.paidAt).format("M")) === (i + 1)
                });

                let amount = 0;
                invoicesOfTheMonth.forEach((invoice: Invoice) => {
                    amount += invoice.tvaApplicable ?
                        invoice.totalAmount + (invoice.totalAmount * 20) / 100
                        :
                        invoice.totalAmount;
                });

                let variation = "";
                if (dataToSet.length > 1) {
                    const previousMonthAmount = dataToSet[i - 1].amount;
                    if (previousMonthAmount < amount && previousMonthAmount > 0) {
                        const increase = amount - previousMonthAmount;
                        variation = `+${((increase / previousMonthAmount) * 100).toFixed()}%`;
                    }
                    if (previousMonthAmount > amount) {
                        const decrease = previousMonthAmount - amount;
                        variation = `-${((decrease / previousMonthAmount) * 100).toFixed()}%`;
                    }
                }

                dataToSet.push({
                    month: dayjs.months()[i],
                    amount,
                    variation
                });
            }
            setChartData(dataToSet);
        }
    }, []);

    useEffect(() => {
        fetchChartData();
    }, [fetchChartData]);

    const selectChartTypeOptions: Option[] = [
        {value: "WAVE", label: "Vague (défault)"},
        {value: "BAR", label: "Barre"},
        {value: "LINE", label: "Ligne"},
        {value: "RADAR", label: "Radar"}
    ];

    const {control, watch} = useForm<{ chartType: Option }>({
        mode: "onChange",
        defaultValues: {chartType: {value: "WAVE", label: "Vague (défault)"}}
    });

    const renderSelectedChart = () => {
        if (chartData) {
            switch (watch("chartType").value) {
                case "WAVE": {
                    return <GenerateWaveChart chartData={chartData}/>;
                }
                case "BAR": {
                    return <GenerateBarChart chartData={chartData}/>;
                }
                case "LINE": {
                    return <GenerateLineChart chartData={chartData}/>;
                }
                case "RADAR": {
                    return <GenerateRadarChart chartData={chartData}/>;
                }
            }
        }
    }

    return <div className="overview__turnoverEvolution">
        <h2>Évolution de votre chiffre d&lsquo;affaire</h2>
        <form>
            <Controller
                name="chartType"
                control={control}
                render={({field}) => (
                    <SelectInput
                        options={selectChartTypeOptions}
                        {...field}
                        isSearchable={false}
                        className="customFormSelectSmall"
                    />
                )}
            />
        </form>
        {renderSelectedChart()}
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

function GenerateWaveChart({chartData}: { chartData: ChartData[] }) {
    return <ResponsiveContainer className="overview__turnoverEvolution-chart">
        <AreaChart margin={{top: 0, right: 0, bottom: 0, left: 0}} data={chartData}>
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
    </ResponsiveContainer>
}

function GenerateBarChart({chartData}: { chartData: ChartData[] }) {
    return <ResponsiveContainer className="overview__turnoverEvolution-chart">
        <BarChart margin={{top: 0, right: 0, bottom: 0, left: 0}} data={chartData}>
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
            <Bar dataKey="amount" fill="var(--primary-color)"/>
        </BarChart>
    </ResponsiveContainer>
}

function GenerateLineChart({chartData}: { chartData: ChartData[] }) {
    return <ResponsiveContainer className="overview__turnoverEvolution-chart">
        <LineChart margin={{top: 0, right: 0, bottom: 0, left: 0}} data={chartData}>
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
            <Line type="monotone" dataKey="amount" stroke="var(--primary-color)" strokeWidth={2}/>
            <Tooltip content={<CustomChartTooltip/>}/>
        </LineChart>
    </ResponsiveContainer>
}

function GenerateRadarChart({chartData}: { chartData: ChartData[] }) {
    return <ResponsiveContainer className="overview__turnoverEvolution-chart">
        <RadarChart margin={{top: 0, right: 0, bottom: 0, left: 0}} data={chartData}>
            <PolarGrid stroke="var(--border-color)"/>
            <PolarAngleAxis
                dataKey="month"
                tick={{fill: "var(--text-color-alt)"}}
            />
            <Radar
                dataKey="amount"
                stroke="var(--primary-color)"
                fillOpacity={1}
                fill="var(--primary-color)"
            />
            <Tooltip content={<CustomChartTooltip/>}/>
        </RadarChart>
    </ResponsiveContainer>
}