import "server-only";

import { headers } from "next/headers";
import type { ProjectsResponse } from "./project";

const PROJECTS_PER_PAGE = 10;

export async function fetchProjects(page: number) {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: PROJECTS_PER_PAGE.toString(),
  });
  const response = await fetch(`${protocol}://${host}/api/v1/users/projects?${searchParams}`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json() as Promise<ProjectsResponse>;
}
