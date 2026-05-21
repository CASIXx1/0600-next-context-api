"use client";

import { useEffect, useMemo, useState } from "react";
import { PaginationProvider } from "@/src/contexts/pagination";
import { ProjectsProvider } from "@/src/contexts/projects";
import { Pagination } from "@/src/components/pagination/Pagination";
import { ProjectList } from "@/src/components/projects/ProjectList";
import { fetchProjects } from "@/src/requests/projects/fetchProjects";
import type { Project, ProjectsResponse } from "@/src/requests/projects/fetchProjects";
import styles from "./page.module.css";

type PageInfo = ProjectsResponse["pageInfo"];

type ProjectsContentProps = {
  requestedPage: number;
};

const INITIAL_PAGE_LIMIT = 10;

export function ProjectsContent({ requestedPage }: ProjectsContentProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>(() => createInitialPageInfo(requestedPage));

  useEffect(() => {
    let isActive = true;

    async function fetcher(): Promise<{ data: Project[]; responsePageInfo: PageInfo }> {
      try {
        const { data, pageInfo: responsePageInfo } = await fetchProjects(requestedPage);

        return { data, responsePageInfo };
      } catch (error) {
        console.error(error);

        return {
          data: [],
          responsePageInfo: createInitialPageInfo(requestedPage),
        };
      }
    }

    async function init() {
      const { data, responsePageInfo } = await fetcher();

      if (!isActive) {
        return;
      }

      setProjects(data);
      setPageInfo(responsePageInfo);
    }

    void init();

    return () => {
      isActive = false;
    };
  }, [requestedPage]);

  const pageCount = useMemo(() => {
    return Math.max(1, Math.ceil(pageInfo.totalCount / pageInfo.limit));
  }, [pageInfo.limit, pageInfo.totalCount]);

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h2 className={styles.title}>プロジェクト</h2>
        </header>

        <div className={styles.body}>
          <div className={styles.projectsHeader}>
            <p>
              {pageInfo.page} / {pageCount} ({pageInfo.totalCount} 件)
            </p>
          </div>

          <ProjectsProvider projects={projects}>
            <ProjectList />
          </ProjectsProvider>
        </div>

        <PaginationProvider
          page={pageInfo.page}
          pageCount={pageCount}
        >
          <footer className={styles.footer}>
            <Pagination />
          </footer>
        </PaginationProvider>
      </div>
    </section>
  );
}

function createInitialPageInfo(page: number): PageInfo {
  return {
    totalCount: 0,
    page,
    limit: INITIAL_PAGE_LIMIT,
  };
}
