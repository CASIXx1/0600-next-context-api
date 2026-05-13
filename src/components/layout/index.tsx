import type { ReactNode } from "react";
import { ProjectsProvider } from "@/src/contexts/projects";
import type { Project } from "@/src/contexts/project";
import styles from "./index.module.css";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

type LayoutProps = {
  children: ReactNode;
  projects: Project[];
};

export function Layout({ children, projects }: LayoutProps) {
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
