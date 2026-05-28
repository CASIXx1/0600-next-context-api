class Requester {
  baseURL: string;
  abortController: AbortController;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.abortController = new AbortController();
  }

  get signal() {
    return this.abortController.signal;
  }

  abort() {
    this.abortController.abort();
  }

  async get<I extends Record<string, any>, O>(endpoint: string, params: I): Promise<O | undefined> {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      const value = (params as any)[key];
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(`${this.baseURL}${endpoint}?${searchParams.toString()}`, {
        method: "GET",
        signal: this.signal,
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        console.log("Request was aborted");
        return;
      }

      throw error;
    }
  }

  async post<I, O>(endpoint: string, data: I): Promise<O | undefined> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: this.signal,
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        console.log("Request was aborted");
        return;
      }

      throw error;
    }
  }

  async patch<I, O>(endpoint: string, data: I): Promise<O | undefined> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        signal: this.signal,
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        console.log("Request was aborted");
        return;
      }

      throw error;
    }
  }
}

class HTTPClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  build(): Requester {
    return new Requester(this.baseUrl);
  }
}

export const httpClient = new HTTPClient("");
