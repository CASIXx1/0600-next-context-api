import type { FetchTasksParams, TasksResponse, UpdateTaskData, UpdateTaskResponse } from "./schema";

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

export async function updateTask(taskId: string, data: UpdateTaskData) {
  const response = await fetch(`/api/v1/users/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update task");
  }

  return response.json() as Promise<UpdateTaskResponse>;
}
