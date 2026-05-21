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

export type ProjectsPageInfo = {
  totalCount: number;
  page: number;
  limit: number;
};

export type ProjectsResponse = {
  data: Project[];
  pageInfo: ProjectsPageInfo;
};

export type FetchProjectsParams = {
  page: number;
  limit: number;
};
