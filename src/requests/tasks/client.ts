import { httpClient } from "../client";
import type { FetchTasksParams, TasksResponse, UpdateTaskData, UpdateTaskResponse } from "./schema";

export class TasksClient {
  requester: ReturnType<typeof httpClient.build>;

  constructor() {
    this.requester = httpClient.build();
  }

  abort() {
    this.requester.abort();
  }

  async fetchTasks({ page, limit, status }: FetchTasksParams): Promise<TasksResponse | undefined> {
    const response = await this.requester.get<FetchTasksParams, TasksResponse>(`/api/v1/users/tasks`, {
      page,
      limit,
      status,
    });
    if (!response) {
      return;
    }

    return response;
  }

  async updateTask(taskId: string, data: UpdateTaskData): Promise<UpdateTaskResponse | undefined> {
    const client = httpClient.build();
    const responseData = await client.patch<UpdateTaskData, UpdateTaskResponse>(`/api/v1/users/tasks/${taskId}`, data);
    if (!responseData) {
      return;
    }

    return responseData;
  }
}
