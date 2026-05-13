import { headers } from "next/headers";
import { ProjectsProvider } from "@/src/contexts/projects";
import { Pagination } from "@/src/components/pagination/Pagination";
import { ProjectList } from "@/src/components/projects/ProjectList";
import type { ProjectsResponse } from "./project";
import styles from "./page.module.css";

const PROJECTS_PER_PAGE = 10;

type ProjectsPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

async function fetchProjects(page: number) {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: PROJECTS_PER_PAGE.toString(),
  });
  const response = await fetch(`${protocol}://${host}/api/v1/users/projects?${searchParams}`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json() as Promise<ProjectsResponse>;
}

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
