import {DataAccess} from "../utils/dataAccess";
import {STATS_TURNOVER_EVOLUTION_URI} from "../config/entrypoints";
import {Invoice} from "../types/Invoice";
import {Collection} from "../types/Collection";

export function fetchTurnoverEvolutionChartData(): Promise<[boolean, Collection<Invoice>]> {
    return DataAccess.request(STATS_TURNOVER_EVOLUTION_URI, {
        method: "GET",
    });
}