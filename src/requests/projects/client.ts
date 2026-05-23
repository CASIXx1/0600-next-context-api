import type { FetchProjectsParams, ProjectsResponse } from "./schema";

export async function fetchProjects({ page, limit }: FetchProjectsParams, options?: RequestInit) {
  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  const response = await fetch(`/api/v1/users/projects?${searchParams}`, {
    cache: "no-store",
    ...options,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json() as Promise<ProjectsResponse>;
}
