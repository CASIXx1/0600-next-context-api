import type { AbortableRequestResult } from "../abort";
import { RequestClient } from "../client";
import type { FetchTasksParams, TasksResponse, UpdateTaskData, UpdateTaskResponse } from "./schema";

export class TasksClient {
  private client = new RequestClient();

  abort() {
    this.client.abort();
  }

  async fetchTasks({ page, limit, status }: FetchTasksParams): Promise<AbortableRequestResult<TasksResponse>> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      status,
    });

    return this.client.request<TasksResponse>(`/api/v1/users/tasks?${params.toString()}`, {
      cache: "no-store",
      errorMessage: "Failed to fetch tasks",
    });
  }

  async updateTask(taskId: string, data: UpdateTaskData): Promise<AbortableRequestResult<UpdateTaskResponse>> {
    return this.client.request<UpdateTaskResponse>(`/api/v1/users/tasks/${taskId}`, {
      body: JSON.stringify(data),
      errorMessage: "Failed to update task",
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
