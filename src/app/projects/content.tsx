"use client";

import { FormMessage } from "@/src/components/atoms/FormMessage";
import { ProjectsProvider, useProjectsList } from "@/src/contexts/projects";
import { Pagination } from "@/src/components/molecules/Pagination";
import { ProjectList } from "@/src/components/organisms/projects/ProjectList";
import styles from "./content.module.css";

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
            <FormMessage
              className={styles.errorMessage}
              tone="error"
            >
              {errorMessage}
            </FormMessage>
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

        <footer className={styles.footer}>
          <Pagination
            getPageHref={(targetPage) => `?page=${targetPage}`}
            page={pageInfo.page}
            pageCount={pageCount}
          />
        </footer>
      </div>
    </section>
  );
}
