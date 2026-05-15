import { PaginationProvider } from "@/src/contexts/pagination";
import { ProjectsProvider } from "@/src/contexts/projects";
import { Pagination } from "@/src/components/pagination/Pagination";
import { ProjectList } from "@/src/components/projects/ProjectList";
import { fetchProjects } from "./fetchProjects";
import styles from "./page.module.css";

type ProjectsPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const requestedPage = Math.max(1, Number(params.page) || 1);
  const { data: projects, pageInfo } = await fetchProjects(requestedPage);
  const page = pageInfo.page;
  const total = pageInfo.totalCount;
  const pageCount = Math.max(1, Math.ceil(total / pageInfo.limit));

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h2 className={styles.title}>プロジェクト</h2>
        </header>

        <div className={styles.body}>
          <div className={styles.projectsHeader}>
            <p>
              {page} / {pageCount} ({total} 件)
            </p>
          </div>

          <ProjectsProvider projects={projects}>
            <ProjectList />
          </ProjectsProvider>
        </div>

        <PaginationProvider
          page={page}
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
