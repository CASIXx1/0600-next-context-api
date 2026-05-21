"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { fetchProjects } from "@/src/requests/projects/fetchProjects";
import type { Project, ProjectsPageInfo } from "@/src/requests/projects/schema";

export type { Project, ProjectsPageInfo };

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
  pageInfo: ProjectsPageInfo;
  projects: Project[];
};

const INITIAL_PAGE_LIMIT = 10;
const PROJECTS_PER_PAGE = 10;
const FETCH_PROJECTS_ERROR_MESSAGE = "プロジェクトの取得に失敗しました。時間をおいて再度お試しください。";

export function useProjectsList({ requestedPage }: UseProjectsListParams): ProjectsListState {
  const [projects, setProjects] = useState<Project[]>([]);
  const [pageInfo, setPageInfo] = useState<ProjectsPageInfo>(() => createInitialPageInfo(requestedPage));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    fetchProjects({
      page: requestedPage,
      limit: PROJECTS_PER_PAGE,
    })
      .then(({ data, pageInfo: responsePageInfo }) => {
        if (!isActive) {
          return;
        }

        setProjects(data);
        setPageInfo(responsePageInfo);
        setErrorMessage(null);
      })
      .catch((error: unknown) => {
        console.error(error);

        if (!isActive) {
          return;
        }

        setProjects([]);
        setPageInfo(createInitialPageInfo(requestedPage));
        setErrorMessage(FETCH_PROJECTS_ERROR_MESSAGE);
      });

    return () => {
      isActive = false;
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
    let isActive = true;

    fetchProjects({
      page: 1,
      limit,
    })
      .then(({ data }) => {
        if (!isActive) {
          return;
        }

        setProjects(data);
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        setProjects([]);
      });

    return () => {
      isActive = false;
    };
  }, [limit]);

  return projects;
}

function createInitialPageInfo(page: number): ProjectsPageInfo {
  return {
    totalCount: 0,
    page,
    limit: INITIAL_PAGE_LIMIT,
  };
}
