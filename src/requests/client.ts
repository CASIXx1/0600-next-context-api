import { runAbortableRequest, type AbortableRequestResult } from "./abort";

type AbortableRequestOptions = RequestInit & {
  errorMessage: string;
};

export class RequestClient {
  private controller = new AbortController();

  abort() {
    this.controller.abort();
  }

  request<T>(input: RequestInfo | URL, options: AbortableRequestOptions): Promise<AbortableRequestResult<T>> {
    const { errorMessage, ...init } = options;

    return runAbortableRequest(async () => {
      const response = await fetch(input, {
        ...init,
        signal: this.controller.signal,
      });

      if (!response.ok) {
        throw new Error(errorMessage);
      }

      return response.json() as Promise<T>;
    });
  }
}
