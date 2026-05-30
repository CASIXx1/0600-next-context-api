export type AbortableRequestResult<T> =
  | {
      data: T;
      status: "success";
    }
  | {
      error: unknown;
      status: "error";
    }
  | {
      status: "aborted";
    };

export async function runAbortableRequest<T>(request: () => Promise<T>): Promise<AbortableRequestResult<T>> {
  try {
    const data = await request();

    return {
      data,
      status: "success",
    };
  } catch (error) {
    if (isAbortError(error)) {
      return {
        status: "aborted",
      };
    }

    return {
      error,
      status: "error",
    };
  }
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}
