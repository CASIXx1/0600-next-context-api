import Link from "next/link";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <nav aria-label="Main navigation">
        <ul className={styles.menu}>
          <li>
            <Link
              className={styles.link}
              href="/"
            >
              ダッシュボード
            </Link>
          </li>
          <li>
            <Link
              className={styles.link}
              href="/tasks"
            >
              タスク
            </Link>
          </li>
          <li>
            <Link
              className={styles.link}
              href="/projects"
            >
              プロジェクト
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
