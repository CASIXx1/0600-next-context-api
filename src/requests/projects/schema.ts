import type { ListResponse } from "../schema";

export type Project = {
  id: string;
  name: string;
  slug: string;
  status: "active" | "archived";
  color: string;
  goal: string;
  shouldbe: string;
  deadline: string;
  createdAt: string;
  updatedAt: string;
  stats: {
    total: number;
    kinds: {
      milestone: number;
      task: number;
      total: number;
    };
    states: {
      scheduled: number;
      completed: number;
      archived: number;
    };
  };
  milestones: string[];
};

export type ProjectsResponse = ListResponse<Project>;

export type ProjectResponse = {
  data: Project;
};

export type FetchProjectsParams = {
  page: number;
  limit: number;
};

export type FetchProjectParams = {
  slug: string;
};
