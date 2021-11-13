import { AUTH_REFRESH_TOKEN_URI } from "../config/entrypoints";
import MemoryJwt from "./memoryJwt";

export class DataAccess {
  private static defaultHeaders: Headers = new Headers({
    Accept: "application/ld+json",
  });

  /**
   * Sends a HTTP request to the Backend Symfony API.
   */
  public static async request(
    endpoint: string,
    requestParams: RequestInit,
    setContentType = true,
    responseBlob = false
  ): Promise<[boolean, any]> {
    this.defaultHeaders.delete("Authorization");

    const jwtToken = MemoryJwt.getToken();
    if (jwtToken) {
      this.defaultHeaders.append("Authorization", `Bearer ${jwtToken}`);
    }

    if (endpoint === AUTH_REFRESH_TOKEN_URI || !setContentType) {
      this.defaultHeaders.delete("Content-Type");
    }

    if (!this.defaultHeaders.has("Content-Type") && setContentType) {
      this.defaultHeaders.append("Content-Type", "application/json");
    }

    const request: Request = new Request(endpoint, {
      ...requestParams,
      headers: this.defaultHeaders,
    });

    const response: Response = await fetch(request)
      .then((response) => response)
      .catch((err) => err);

    if (response.status === 204) {
      return [response.ok, []];
    } else {
      let responseData: Record<string, any>;
      if (responseBlob) {
        responseData = [await response.blob(), response.headers];
      } else {
        responseData = await response.json();
      }

      return [response.ok, responseData];
    }
  }

  public static setHeader(key: string, value: string): void {
    this.defaultHeaders.append(key, value);
  }

  public static removeHeader(key: string): void {
    this.defaultHeaders.delete(key);
  }
}
