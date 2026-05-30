type AbortableRequestResult<T> =
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

export function runAbortableEffect(init: (signal: AbortSignal) => void) {
  const controller = new AbortController();

  init(controller.signal);

  return () => {
    controller.abort();
  };
}

export async function runAbortableRequest<T>(
  signal: AbortSignal,
  request: (signal: AbortSignal) => Promise<T>,
): Promise<AbortableRequestResult<T>> {
  try {
    const data = await request(signal);

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
