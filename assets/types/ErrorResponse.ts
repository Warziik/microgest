import { Violation } from "./Violation";

export interface ErrorResponse {
    "@context": string;
    "@type": string;
    "hydra:title": string;
    "hydra:description": string;
    "trace"?: Array<Record<string, any>>;
    "violations"?: Violation[];
}