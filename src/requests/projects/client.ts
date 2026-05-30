import { runAbortableRequest, type AbortableRequestResult } from "../abort";
import type { FetchProjectsParams, ProjectsResponse } from "./schema";

export class ProjectsClient {
  private controller = new AbortController();

  abort() {
    this.controller.abort();
  }

  async fetchProjects({ page, limit }: FetchProjectsParams): Promise<AbortableRequestResult<ProjectsResponse>> {
    return runAbortableRequest(async () => {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      const response = await fetch(`/api/v1/users/projects?${searchParams}`, {
        cache: "no-store",
        signal: this.controller.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      return response.json() as Promise<ProjectsResponse>;
    });
  }
}
