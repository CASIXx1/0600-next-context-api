import type { Project } from "../projects/schema";

export type TaskStatus = "scheduled" | "completed" | "archived";

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  deadline: string;
  project: Project;
};

export type TasksPageInfo = {
  page: number;
  limit: number;
  totalCount: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
};

export type TasksResponse = {
  data: Task[];
  pageInfo: TasksPageInfo;
};

export type FetchTasksParams = {
  page: number;
  limit: number;
  status: TaskStatus;
};

export type UpdateTaskData = Partial<Pick<Task, "deadline" | "title">> & {
  projectId?: string;
  status?: TaskStatus;
};

export type UpdateTaskResponse = {
  data: Task;
};
