import { runAbortableRequest, type AbortableRequestResult } from "../abort";
import type { StatsResponse } from "./schema";

export class StatsClient {
  private controller = new AbortController();

  abort() {
    this.controller.abort();
  }

  async fetchStats(): Promise<AbortableRequestResult<StatsResponse>> {
    return runAbortableRequest(async () => {
      const response = await fetch("/api/v1/users/stats", {
        cache: "no-store",
        signal: this.controller.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }

      return response.json() as Promise<StatsResponse>;
    });
  }
}
