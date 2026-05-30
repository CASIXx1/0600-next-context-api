import type { AbortableRequestResult } from "../abort";
import { RequestClient } from "../client";
import type { FetchProjectsParams, ProjectsResponse } from "./schema";

export class ProjectsClient {
  private client = new RequestClient();

  abort() {
    this.client.abort();
  }

  async fetchProjects({ page, limit }: FetchProjectsParams): Promise<AbortableRequestResult<ProjectsResponse>> {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return this.client.request<ProjectsResponse>(`/api/v1/users/projects?${searchParams}`, {
      cache: "no-store",
      errorMessage: "Failed to fetch projects",
    });
  }
}
