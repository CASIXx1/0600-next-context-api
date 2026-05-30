import type { AbortableRequestResult } from "../abort";
import { RequestClient } from "../client";
import type { StatsResponse } from "./schema";

export class StatsClient {
  private client = new RequestClient();

  abort() {
    this.client.abort();
  }

  async fetchStats(): Promise<AbortableRequestResult<StatsResponse>> {
    return this.client.get<StatsResponse>(
      "/api/v1/users/stats",
      {},
      {
        errorMessage: "Failed to fetch stats",
      },
    );
  }
}
