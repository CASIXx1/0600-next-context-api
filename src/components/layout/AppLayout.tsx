import type { ReactNode } from "react";
import styles from "./AppLayout.module.css";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <Sidebar />
        <div className={styles.mainContent}>{children}</div>
      </main>
    </div>
  );
}
