"use client";

import { PaginationProvider } from "@/src/contexts/pagination";
import { ProjectsProvider, useProjectsList } from "@/src/contexts/projects";
import { Pagination } from "@/src/components/pagination/Pagination";
import { ProjectList } from "@/src/components/projects/ProjectList";
import styles from "./page.module.css";

type ProjectsContentProps = {
  requestedPage: number;
};

export function ProjectsContent({ requestedPage }: ProjectsContentProps) {
  const { errorMessage, pageCount, pageInfo, projects } = useProjectsList({ requestedPage });

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h2 className={styles.title}>プロジェクト</h2>
        </header>

        <div className={styles.body}>
          {errorMessage ? (
            <p
              className={styles.errorMessage}
              role="alert"
            >
              {errorMessage}
            </p>
          ) : null}

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
