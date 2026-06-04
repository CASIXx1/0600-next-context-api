const ABORTABLE_REQUEST_STATUS = {
  aborted: "aborted",
  error: "error",
  success: "success",
} as const;

export type AbortableRequestResult<T> =
  | {
      data: T;
      status: typeof ABORTABLE_REQUEST_STATUS.success;
    }
  | {
      error: unknown;
      status: typeof ABORTABLE_REQUEST_STATUS.error;
    }
  | {
      status: typeof ABORTABLE_REQUEST_STATUS.aborted;
    };

export function createSuccessResult<T>(data: T): AbortableRequestResult<T> {
  return {
    data,
    status: ABORTABLE_REQUEST_STATUS.success,
  };
}

export function createErrorResult<T>(error: unknown): AbortableRequestResult<T> {
  return {
    error,
    status: ABORTABLE_REQUEST_STATUS.error,
  };
}

export function createAbortedResult<T>(): AbortableRequestResult<T> {
  return {
    status: ABORTABLE_REQUEST_STATUS.aborted,
  };
}

export function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}
