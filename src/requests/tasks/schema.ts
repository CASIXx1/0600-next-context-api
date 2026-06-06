import type { Project } from "../projects/schema";
import type { ListResponse } from "../schema";

export type TaskStatus = "scheduled" | "completed" | "archived";

export type Task = {
  createdAt: string;
  description: string;
  deadline: string;
  id: string;
  project: Project;
  status: TaskStatus;
  title: string;
  updatedAt: string;
};

export type TasksResponse = ListResponse<Task>;

export type FetchTasksParams = {
  page: number;
  limit: number;
  status: TaskStatus;
};

export type FetchTaskResponse = {
  data: Task;
};

export type UpdateTaskData = Partial<Pick<Task, "deadline" | "description" | "title">> & {
  projectId?: string;
  status?: TaskStatus;
};

export type CreateTaskData = Pick<Task, "deadline" | "status" | "title"> & {
  children: [];
  description: string;
  kind: "task";
  projectId: string;
};

export type CreateTaskResponse = {
  data: null;
};

export type DeleteTaskResponse = {
  data: Task[];
};

export type UpdateTaskResponse = {
  data: Task;
};
