"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ProjectsProvider } from "@/src/contexts/projects";
import type { Project } from "@/src/contexts/project";
import { fetchProjects } from "@/src/requests/projects/fetchProjects";
import styles from "./index.module.css";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const abortController = new AbortController();

    fetchProjects(1, { signal: abortController.signal })
      .then(({ data }) => setProjects(data))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setProjects([]);
      });

    return () => abortController.abort();
  }, []);

  return (
    <ProjectsProvider projects={projects}>
      <div className={styles.layout}>
        <Header />
        <main className={styles.main}>
          <Sidebar />
          <div className={styles.mainContent}>{children}</div>
        </main>
      </div>
    </ProjectsProvider>
  );
}
