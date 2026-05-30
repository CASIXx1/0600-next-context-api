import type { FetchProjectsParams, ProjectsResponse } from "./schema";
import { httpClient } from "../client";

export class ProjectsClient {
  requester: ReturnType<typeof httpClient.build>;

  constructor() {
    this.requester = httpClient.build();
  }

  abort() {
    this.requester.abort();
  }

  async fetchProjects({ page, limit }: FetchProjectsParams): Promise<ProjectsResponse | undefined> {
    const response = await this.requester.get<FetchProjectsParams, ProjectsResponse>(`/api/v1/users/projects`, {
      page,
      limit,
    });
    if (!response) {
      return;
    }

    return response;
  }
}
