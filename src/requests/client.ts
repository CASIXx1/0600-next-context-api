import {
  createAbortedResult,
  createErrorResult,
  createSuccessResult,
  isAbortError,
  type AbortableRequestResult,
} from "./result";

type AbortableRequestOptions = RequestInit & {
  errorMessage: string;
};

type QueryParams = Record<string, string | number | boolean | null | undefined>;

type RequestOptions = {
  errorMessage: string;
};

export class HttpRequester {
  private controller = new AbortController();

  abort() {
    this.controller.abort();
  }

  private async request<T>(
    input: RequestInfo | URL,
    options: AbortableRequestOptions,
  ): Promise<AbortableRequestResult<T>> {
    const { errorMessage, ...init } = options;

    try {
      const response = await fetch(input, {
        ...init,
        signal: this.controller.signal,
      });

      if (!response.ok) {
        throw new Error(errorMessage);
      }

      const data = (await response.json()) as T;

      return createSuccessResult(data);
    } catch (error) {
      if (isAbortError(error)) {
        return createAbortedResult();
      }

      return createErrorResult(error);
    }
  }

  get<T>(endpoint: string, params: QueryParams, options: RequestOptions): Promise<AbortableRequestResult<T>> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    const query = searchParams.toString();
    const url = query ? `${endpoint}?${query}` : endpoint;

    return this.request<T>(url, {
      cache: "no-store",
      errorMessage: options.errorMessage,
    });
  }

  patch<Data, Response>(
    endpoint: string,
    data: Data,
    options: RequestOptions,
  ): Promise<AbortableRequestResult<Response>> {
    return this.request<Response>(endpoint, {
      body: JSON.stringify(data),
      errorMessage: options.errorMessage,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
