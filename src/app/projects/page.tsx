import { Pagination } from "@/src/components/pagination/Pagination";
import { ProjectList } from "@/src/components/projects/ProjectList";
import { getProjects } from "@/src/app/api/datastore";
import styles from "./page.module.css";

const PROJECTS_PER_PAGE = 10;

export default async function ProjectsPage() {
  const projects = getProjects();
  const page = 1;
  const total = projects.length;
  const pageCount = Math.max(1, Math.ceil(total / PROJECTS_PER_PAGE));
  const start = (page - 1) * PROJECTS_PER_PAGE;
  const end = Math.min(page * PROJECTS_PER_PAGE, total);
  const visibleProjects = projects.slice(start, end);

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>プロジェクト</h1>
        </header>

        <div className={styles.body}>
          <div className={styles.projectsHeader}>
            <p>
              {page} / {pageCount} ({total} 件)
            </p>
          </div>

          <ProjectList projects={visibleProjects} />
        </div>

        <footer className={styles.footer}>
          <Pagination
            page={page}
            pageCount={pageCount}
          />
        </footer>
      </div>
    </section>
  );
}
