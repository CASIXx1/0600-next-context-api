import type { AbortableRequestResult } from "../result";
import { HttpRequester } from "../client";
import type {
  CreateTaskData,
  CreateTaskResponse,
  DeleteTaskResponse,
  FetchTaskResponse,
  FetchTasksParams,
  TasksResponse,
  UpdateTaskData,
  UpdateTaskResponse,
} from "./schema";

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

  async fetchTask(taskId: string): Promise<AbortableRequestResult<FetchTaskResponse>> {
    return this.requester.get<FetchTaskResponse>(
      `/api/v1/users/tasks/${taskId}`,
      {},
      {
        errorMessage: "Failed to fetch task",
      },
    );
  }

  async updateTask(taskId: string, data: UpdateTaskData): Promise<AbortableRequestResult<UpdateTaskResponse>> {
    return this.requester.patch<UpdateTaskData, UpdateTaskResponse>(`/api/v1/users/tasks/${taskId}`, data, {
      errorMessage: "Failed to update task",
    });
  }

  async createTask(data: CreateTaskData): Promise<AbortableRequestResult<CreateTaskResponse>> {
    return this.requester.post<CreateTaskData, CreateTaskResponse>("/api/v1/users/tasks", data, {
      errorMessage: "Failed to create task",
    });
  }

  async deleteTask(taskId: string): Promise<AbortableRequestResult<DeleteTaskResponse>> {
    return this.requester.delete<DeleteTaskResponse>(`/api/v1/users/tasks/${taskId}`, {
      errorMessage: "Failed to delete task",
    });
  }
}
