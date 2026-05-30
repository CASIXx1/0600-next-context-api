import type { AbortableRequestResult } from "../abort";
import { HttpRequester } from "../client";
import type { StatsResponse } from "./schema";

export class StatsClient {
  private requester = new HttpRequester();

  abort() {
    this.requester.abort();
  }

  async fetchStats(): Promise<AbortableRequestResult<StatsResponse>> {
    return this.requester.get<StatsResponse>(
      "/api/v1/users/stats",
      {},
      {
        errorMessage: "Failed to fetch stats",
      },
    );
  }
}
