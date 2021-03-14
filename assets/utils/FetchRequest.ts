const headers: Headers = new Headers({ "Content-Type": "application/json", "Accept": "application/ld+json" });

export default async function fetchRequest(uri: string, bodyParams: any, method = "POST"): Promise<[boolean, Record<string, unknown>]> {
    const request: Request = new Request(uri, {
        method: method,
        body: JSON.stringify(bodyParams),
        headers
    });

    const response: any = await fetch(request)
        .then(response => response)
        .catch(err => console.error(err));

    const responseData = await response.json();

    return [response.ok, responseData];
}