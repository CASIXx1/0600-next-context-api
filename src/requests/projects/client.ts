import type { AbortableRequestResult } from "../abort";
import { HttpRequester } from "../client";
import type { FetchProjectsParams, ProjectsResponse } from "./schema";

export class ProjectsClient {
  private requester = new HttpRequester();

  abort() {
    this.requester.abort();
  }

  async fetchProjects({ page, limit }: FetchProjectsParams): Promise<AbortableRequestResult<ProjectsResponse>> {
    return this.requester.get<ProjectsResponse>(
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
