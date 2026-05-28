import type { StatsResponse } from "./schema";
import { httpClient } from "../client";

export class StatsClient {
  requester: ReturnType<typeof httpClient.build>;
  constructor() {
    this.requester = httpClient.build();
  }

  async fetchStats(): Promise<StatsResponse | undefined> {
    const data = await this.requester.get<{}, StatsResponse>("/api/v1/users/stats", {});
    if (!data) {
      return;
    }

    return data;
  }

  abort() {
    this.requester.abort();
  }
}
