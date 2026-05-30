import type { AbortableRequestResult } from "../abort";
import { RequestClient } from "../client";
import type { StatsResponse } from "./schema";

export class StatsClient {
  private client = new RequestClient();

  abort() {
    this.client.abort();
  }

  async fetchStats(): Promise<AbortableRequestResult<StatsResponse>> {
    return this.client.request<StatsResponse>("/api/v1/users/stats", {
      cache: "no-store",
      errorMessage: "Failed to fetch stats",
    });
  }
}
