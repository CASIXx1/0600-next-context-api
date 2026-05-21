import type { Project } from "@/src/requests/projects/fetchProjects";

export type TaskStatus = "scheduled" | "completed" | "archived";

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  deadline: string;
  project: Project;
};

export type PageInfo = {
  page: number;
  limit: number;
  totalCount: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
};

export type TasksResponse = {
  data: Task[];
  pageInfo: PageInfo;
};

type FetchTasksParams = {
  page: number;
  limit: number;
  status: TaskStatus;
};

export async function fetchTasks({ page, limit, status }: FetchTasksParams, options?: RequestInit) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    status,
  });
  const response = await fetch(`/api/v1/users/tasks?${params.toString()}`, {
    cache: "no-store",
    ...options,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return response.json() as Promise<TasksResponse>;
}
