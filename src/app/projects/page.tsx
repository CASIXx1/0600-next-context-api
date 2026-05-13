import { headers } from "next/headers";
import { ProjectsProvider } from "@/src/contexts/projects";
import { Pagination } from "@/src/components/pagination/Pagination";
import { ProjectList } from "@/src/components/projects/ProjectList";
import type { ProjectsResponse } from "./project";
import styles from "./page.module.css";

const PROJECTS_PER_PAGE = 10;

async function fetchProjects() {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const response = await fetch(`${protocol}://${host}/api/v1/users/projects?page=1&limit=${PROJECTS_PER_PAGE}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json() as Promise<ProjectsResponse>;
}

export default async function ProjectsPage() {
  const { data: projects, pageInfo } = await fetchProjects();
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
