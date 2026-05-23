"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { fetchProjects } from "@/src/requests/projects/client";
import type { PageInfo } from "@/src/requests/schema";
import type { Project } from "@/src/requests/projects/schema";

export type { PageInfo, Project };

const ProjectsContext = createContext<Project[] | null>(null);

type ProjectsProviderProps = {
  children: ReactNode;
  projects: Project[];
};

export function ProjectsProvider({ children, projects }: ProjectsProviderProps) {
  return <ProjectsContext value={projects}>{children}</ProjectsContext>;
}

export function useProjects(): Project[] {
  const projects = useContext(ProjectsContext);

  if (!projects) {
    throw new Error("useProjects must be used within ProjectsProvider");
  }

  return projects;
}

type UseProjectsListParams = {
  requestedPage: number;
};

type UseProjectMenuProjectsParams = {
  limit: number;
};

type ProjectsListState = {
  errorMessage: string | null;
  pageCount: number;
  pageInfo: PageInfo;
  projects: Project[];
};

const INITIAL_PAGE_LIMIT = 10;
const PROJECTS_PER_PAGE = 10;
const FETCH_PROJECTS_ERROR_MESSAGE = "プロジェクトの取得に失敗しました。時間をおいて再度お試しください。";

export function useProjectsList({ requestedPage }: UseProjectsListParams): ProjectsListState {
  const [projects, setProjects] = useState<Project[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>(() => createInitialPageInfo(requestedPage));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function init() {
      let nextProjects: Project[] = [];
      let nextPageInfo = createInitialPageInfo(requestedPage);
      let nextErrorMessage: string | null = null;

      try {
        const { data, pageInfo: responsePageInfo } = await fetchProjects(
          {
            page: requestedPage,
            limit: PROJECTS_PER_PAGE,
          },
          {
            signal: controller.signal,
          },
        );

        nextProjects = data;
        nextPageInfo = responsePageInfo;
      } catch (error) {
        if (isAbortError(error)) {
          return;
        }

        console.error(error);

        nextErrorMessage = FETCH_PROJECTS_ERROR_MESSAGE;
      }

      setProjects(nextProjects);
      setPageInfo(nextPageInfo);
      setErrorMessage(nextErrorMessage);
    }

    void init();

    return () => {
      controller.abort();
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
    const controller = new AbortController();

    async function init() {
      let nextProjects: Project[] = [];

      try {
        const { data } = await fetchProjects(
          {
            page: 1,
            limit,
          },
          {
            signal: controller.signal,
          },
        );

        nextProjects = data;
      } catch (error) {
        if (isAbortError(error)) {
          return;
        }

        nextProjects = [];
      }

      setProjects(nextProjects);
    }

    void init();

    return () => {
      controller.abort();
    };
  }, [limit]);

  return projects;
}

function createInitialPageInfo(page: number): PageInfo {
  return {
    totalCount: 0,
    page,
    limit: INITIAL_PAGE_LIMIT,
  };
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}
