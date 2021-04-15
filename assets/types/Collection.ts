export interface Collection<T> {
    "@context": string;
    "@id": string;
    "@type": string;
    "hydra:firstPage"?: string;
    "hydra:itemsPerPage"?: number;
    "hydra:lastPage"?: string;
    "hydra:member": T[];
    "hydra:nextPage"?: string;
    "hydra:search"?: Record<string, unknown>;
    "hydra:totalItems": number;
}
