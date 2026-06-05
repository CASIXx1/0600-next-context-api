"use client";

import { ProjectProvider, useProjectDetail } from "@/src/contexts/projects";
import { ProjectDetail } from "@/src/components/projects/ProjectDetail";
import styles from "./content.module.css";

type ProjectDetailContentProps = {
  slug: string;
};

export function ProjectDetailContent({ slug }: ProjectDetailContentProps) {
  const { errorMessage, isProjectLoaded, project } = useProjectDetail({ slug });
  const showLoading = !isProjectLoaded;
  const showError = Boolean(errorMessage);
  const showNotFound = isProjectLoaded && !project && !errorMessage;
  const showDetail = isProjectLoaded && project && !errorMessage;

  return (
    <section className={styles.container}>
      <div className={styles.body}>
        {showLoading ? <p className={styles.statePanel}>読み込み中...</p> : null}

        {showError ? (
          <p
            className={`${styles.statePanel} ${styles.errorPanel}`}
            role="alert"
          >
            {errorMessage}
          </p>
        ) : null}

        {showNotFound ? (
          <p
            className={styles.statePanel}
            role="status"
          >
            プロジェクトが見つかりませんでした。
          </p>
        ) : null}

        {showDetail ? (
          <ProjectProvider project={project}>
            <ProjectDetail />
          </ProjectProvider>
        ) : null}
      </div>
    </section>
  );
}
