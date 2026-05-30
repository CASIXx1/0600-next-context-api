import { runAbortableRequest, type AbortableRequestResult } from "../abort";
import type { FetchTasksParams, TasksResponse, UpdateTaskData, UpdateTaskResponse } from "./schema";

export class TasksClient {
  private controller = new AbortController();

  abort() {
    this.controller.abort();
  }

  async fetchTasks({ page, limit, status }: FetchTasksParams): Promise<AbortableRequestResult<TasksResponse>> {
    return runAbortableRequest(async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        status,
      });
      const response = await fetch(`/api/v1/users/tasks?${params.toString()}`, {
        cache: "no-store",
        signal: this.controller.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      return response.json() as Promise<TasksResponse>;
    });
  }

  async updateTask(taskId: string, data: UpdateTaskData) {
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
}
