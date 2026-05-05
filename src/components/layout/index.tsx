import type { ReactNode } from "react";
import styles from "./index.module.css";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
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
