import MemoryJwt from "./memoryJwt";

export class DataAccess {
    private static defaultHeaders: Headers = new Headers({
        "Content-Type": "application/json",
        "Accept": "application/ld+json"
    });

    /**
     * Send a HTTP request to the API.
     */
    public static async request(endpoint: string, requestParams: RequestInit): Promise<[boolean, Record<string, any>]> {
        const jwtToken = MemoryJwt.getToken();
        if (jwtToken) {
            this.defaultHeaders.append("Authorization", `Bearer ${jwtToken}`);
        }

        const request: Request = new Request(
            endpoint,
            { ...requestParams, headers: this.defaultHeaders }
        );

        const response: Response | any = await fetch(request)
            .then(response => response)
            .catch(err => console.error(err));

        const responseData: Record<string, any> = await response.json();

        return [response.ok, responseData];
    }

    public static setHeader(key: string, value: string): void {
        this.defaultHeaders.append(key, value);
    }

    public static removeHeader(key: string): void {
        this.defaultHeaders.delete(key);
    }
}