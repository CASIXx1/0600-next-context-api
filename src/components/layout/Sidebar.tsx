import Link from "next/link";
import { IoChevronBack } from "react-icons/io5";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.toggle}>
            <IoChevronBack aria-hidden="true" />
          </span>
        </div>
        <div className={styles.body}>
          <nav aria-label="Main navigation">
            <ul>
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
        </div>
      </div>
    </aside>
  );
}
