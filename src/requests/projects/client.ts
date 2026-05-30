import type { AbortableRequestResult } from "../abort";
import { RequestClient } from "../client";
import type { FetchProjectsParams, ProjectsResponse } from "./schema";

export class ProjectsClient {
  private client = new RequestClient();

  abort() {
    this.client.abort();
  }

  async fetchProjects({ page, limit }: FetchProjectsParams): Promise<AbortableRequestResult<ProjectsResponse>> {
    return this.client.get<ProjectsResponse>(
      "/api/v1/users/projects",
      {
        page,
        limit,
      },
      {
        errorMessage: "Failed to fetch projects",
      },
    );
  }
}
