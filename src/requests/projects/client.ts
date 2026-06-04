import type { AbortableRequestResult } from "../result";
import { HttpRequester } from "../client";
import type { FetchProjectParams, FetchProjectsParams, ProjectResponse, ProjectsResponse } from "./schema";

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

  async fetchProject({ slug }: FetchProjectParams): Promise<AbortableRequestResult<ProjectResponse>> {
    return this.requester.get<ProjectResponse>(
      `/api/v1/users/projects/${slug}`,
      {},
      {
        errorMessage: "Failed to fetch project",
      },
    );
  }
}
