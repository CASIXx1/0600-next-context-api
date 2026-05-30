import type { AbortableRequestResult } from "../abort";
import { RequestClient } from "../client";
import type { FetchTasksParams, TasksResponse, UpdateTaskData, UpdateTaskResponse } from "./schema";

export class TasksClient {
  private client = new RequestClient();

  abort() {
    this.client.abort();
  }

  async fetchTasks({ page, limit, status }: FetchTasksParams): Promise<AbortableRequestResult<TasksResponse>> {
    return this.client.get<TasksResponse>(
      "/api/v1/users/tasks",
      {
        page,
        limit,
        status,
      },
      {
        errorMessage: "Failed to fetch tasks",
      },
    );
  }

  async updateTask(taskId: string, data: UpdateTaskData): Promise<AbortableRequestResult<UpdateTaskResponse>> {
    return this.client.patch<UpdateTaskData, UpdateTaskResponse>(`/api/v1/users/tasks/${taskId}`, data, {
      errorMessage: "Failed to update task",
    });
  }
}
