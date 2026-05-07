import type { ReactNode } from "react";
import type { Project } from "@/src/types/project";
import styles from "./index.module.css";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

type LayoutProps = {
  children: ReactNode;
  projects: Project[];
};

export function Layout({ children, projects }: LayoutProps) {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <Sidebar projects={projects} />
        <div className={styles.mainContent}>{children}</div>
      </main>
    </div>
  );
}
