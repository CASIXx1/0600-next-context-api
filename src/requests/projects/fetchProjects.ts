const PROJECTS_PER_PAGE = 10;

export type Project = {
  id: string;
  name: string;
  slug: string;
  status: "active" | "archived";
  color: string;
  goal: string;
  shouldbe: string;
  deadline: string;
  createdAt: string;
  updatedAt: string;
  stats: {
    total: number;
    kinds: {
      milestone: number;
      task: number;
      total: number;
    };
    states: {
      scheduled: number;
      completed: number;
      archived: number;
    };
  };
  milestones: string[];
};

export type ProjectsResponse = {
  data: Project[];
  pageInfo: {
    totalCount: number;
    page: number;
    limit: number;
  };
};

export async function fetchProjects(page: number, options?: RequestInit) {
  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: PROJECTS_PER_PAGE.toString(),
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
