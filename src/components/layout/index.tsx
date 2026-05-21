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

const PROJECT_MENU_PROJECTS_LIMIT = 100;

export function Layout({ children }: LayoutProps) {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    let isActive = true;

    fetchProjects({
      page: 1,
      limit: PROJECT_MENU_PROJECTS_LIMIT,
    })
      .then(({ data }) => {
        if (!isActive) {
          return;
        }

        setProjects(data);
      })
      .catch((_error: unknown) => {
        if (!isActive) {
          return;
        }

        setProjects([]);
      });

    return () => {
      isActive = false;
    };
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
