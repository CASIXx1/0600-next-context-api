import type { AbortableRequestResult } from "../result";
import { HttpRequester } from "../client";
import type { FetchTasksParams, TasksResponse, UpdateTaskData, UpdateTaskResponse } from "./schema";

export class TasksClient {
  private requester = new HttpRequester();

  abort() {
    this.requester.abort();
  }

  async fetchTasks({ page, limit, status }: FetchTasksParams): Promise<AbortableRequestResult<TasksResponse>> {
    return this.requester.get<TasksResponse>(
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
    return this.requester.patch<UpdateTaskData, UpdateTaskResponse>(`/api/v1/users/tasks/${taskId}`, data, {
      errorMessage: "Failed to update task",
    });
  }
}
