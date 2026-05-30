"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { runAbortableEffect, runAbortableRequest } from "@/src/requests/abort";
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
    return runAbortableEffect((signal) => {
      async function init() {
        let nextProjects: Project[] = [];
        let nextPageInfo = createInitialPageInfo(requestedPage);
        let nextErrorMessage: string | null = null;

        const result = await runAbortableRequest(signal, (requestSignal) =>
          fetchProjects(
            {
              page: requestedPage,
              limit: PROJECTS_PER_PAGE,
            },
            {
              signal: requestSignal,
            },
          ),
        );

        if (result.status === "aborted") {
          return;
        }

        if (result.status === "success") {
          nextProjects = result.data.data;
          nextPageInfo = result.data.pageInfo;
        } else {
          console.error(result.error);

          nextErrorMessage = FETCH_PROJECTS_ERROR_MESSAGE;
        }

        setProjects(nextProjects);
        setPageInfo(nextPageInfo);
        setErrorMessage(nextErrorMessage);
      }

      void init();
    });
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
    return runAbortableEffect((signal) => {
      async function init() {
        let nextProjects: Project[] = [];

        const result = await runAbortableRequest(signal, (requestSignal) =>
          fetchProjects(
            {
              page: 1,
              limit,
            },
            {
              signal: requestSignal,
            },
          ),
        );

        if (result.status === "aborted") {
          return;
        }

        if (result.status === "success") {
          nextProjects = result.data.data;
        } else {
          nextProjects = [];
        }

        setProjects(nextProjects);
      }

      void init();
    });
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
