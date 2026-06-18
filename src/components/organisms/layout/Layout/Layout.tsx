"use client";

import { type ReactNode } from "react";
import { ProjectsProvider, useProjectMenuProjects } from "@/src/contexts/projects";
import styles from "./Layout.module.css";
import { Header } from "../Header";
import { Sidebar } from "../Sidebar";

type LayoutProps = {
  children: ReactNode;
};

const PROJECT_MENU_PROJECTS_LIMIT = 100;

export function Layout({ children }: LayoutProps) {
  const projects = useProjectMenuProjects({ limit: PROJECT_MENU_PROJECTS_LIMIT });

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
