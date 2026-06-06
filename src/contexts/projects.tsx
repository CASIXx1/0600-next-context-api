"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ProjectsClient } from "@/src/requests/projects/client";
import type { PageInfo } from "@/src/requests/schema";
import type { Project } from "@/src/requests/projects/schema";

export type { PageInfo, Project };

const ProjectsContext = createContext<Project[] | null>(null);
const ProjectContext = createContext<Project | null>(null);

type ProjectsProviderProps = {
  children: ReactNode;
  projects: Project[];
};

type ProjectProviderProps = {
  children: ReactNode;
  project: Project;
};

export function ProjectsProvider({ children, projects }: ProjectsProviderProps) {
  return <ProjectsContext value={projects}>{children}</ProjectsContext>;
}

export function ProjectProvider({ children, project }: ProjectProviderProps) {
  return <ProjectContext value={project}>{children}</ProjectContext>;
}

export function useProjects(): Project[] {
  const projects = useContext(ProjectsContext);

  if (!projects) {
    throw new Error("useProjects must be used within ProjectsProvider");
  }

  return projects;
}

export function useProject(): Project {
  const project = useContext(ProjectContext);

  if (!project) {
    throw new Error("useProject must be used within ProjectProvider");
  }

  return project;
}

type UseProjectsListParams = {
  requestedPage: number;
};

type UseProjectMenuProjectsParams = {
  limit: number;
};

type UseProjectDetailParams = {
  slug: string;
};

type ProjectsListState = {
  errorMessage: string | null;
  pageCount: number;
  pageInfo: PageInfo;
  projects: Project[];
};

type ProjectDetailState = {
  errorMessage: string | null;
  isProjectLoaded: boolean;
  project: Project | null;
};

const INITIAL_PAGE_LIMIT = 10;
const PROJECTS_PER_PAGE = 10;
const FETCH_PROJECTS_ERROR_MESSAGE = "プロジェクトの取得に失敗しました。時間をおいて再度お試しください。";
const FETCH_PROJECT_ERROR_MESSAGE = "プロジェクト詳細の取得に失敗しました。時間をおいて再度お試しください。";

export function useProjectsList({ requestedPage }: UseProjectsListParams): ProjectsListState {
  const [projects, setProjects] = useState<Project[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>(() => createInitialPageInfo(requestedPage));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const client = new ProjectsClient();

    async function init() {
      const result = await client.fetchProjects({
        page: requestedPage,
        limit: PROJECTS_PER_PAGE,
      });

      const projects = result.status === "success" ? result.data.data : [];
      const pageInfo = result.status === "success" ? result.data.pageInfo : createInitialPageInfo(requestedPage);
      const errorMessage = result.status === "error" ? FETCH_PROJECTS_ERROR_MESSAGE : null;

      setProjects(projects);
      setPageInfo(pageInfo);
      setErrorMessage(errorMessage);
    }

    void init();

    return () => {
      client.abort();
    };
  }, [requestedPage]);

  const pageCount = useMemo(() => {
    return Math.max(1, Math.ceil(pageInfo.totalCount / pageInfo.limit));
  }, [pageInfo.limit, pageInfo.totalCount]);

  return {
    errorMessage,
    pageCount,
    pageInfo,
    projects,
  };
}

export function useProjectMenuProjects({ limit }: UseProjectMenuProjectsParams) {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const client = new ProjectsClient();

    async function init() {
      const result = await client.fetchProjects({
        page: 1,
        limit,
      });

      const projects = result.status === "success" ? result.data.data : [];

      setProjects(projects);
    }

    void init();

    return () => {
      client.abort();
    };
  }, [limit]);

  return projects;
}

export function useProjectDetail({ slug }: UseProjectDetailParams): ProjectDetailState {
  const [project, setProject] = useState<Project | null>(null);
  const [isProjectLoaded, setIsProjectLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const client = new ProjectsClient();

    async function init() {
      const result = await client.fetchProject({ slug });

      const project = result.status === "success" ? result.data.data : null;
      const errorMessage = result.status === "error" ? FETCH_PROJECT_ERROR_MESSAGE : null;

      setProject(project);
      setErrorMessage(errorMessage);
      setIsProjectLoaded(true);
    }

    void init();

    return () => {
      client.abort();
    };
  }, [slug]);

  return {
    errorMessage,
    isProjectLoaded,
    project,
  };
}

function createInitialPageInfo(page: number): PageInfo {
  return {
    totalCount: 0,
    page,
    limit: INITIAL_PAGE_LIMIT,
  };
}
