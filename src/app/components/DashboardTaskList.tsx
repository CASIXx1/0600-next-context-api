import Link from "next/link";
import { IoArrowForward, IoCalendarClear } from "react-icons/io5";
import { formatDate } from "@/src/lib/date/format";
import type { Task } from "@/src/contexts/tasks";
import styles from "./DashboardTaskList.module.css";

type DashboardTaskListProps = {
  tasks: Task[];
};

export function DashboardTaskList({ tasks }: DashboardTaskListProps) {
  if (tasks.length === 0) {
    return <p className={styles.empty}>未完了のタスクはありません</p>;
  }

  return (
    <ul className={styles.list}>
      {tasks.map((task) => (
        <li
          className={styles.item}
          key={task.id}
        >
          <div className={styles.main}>
            <span
              className={styles.projectDot}
              style={{ backgroundColor: task.project.color }}
              aria-hidden="true"
            />
            <div className={styles.text}>
              <p className={styles.title}>{task.title}</p>
              <p className={styles.projectName}>{task.project.name}</p>
            </div>
          </div>

          <p className={styles.deadline}>
            <IoCalendarClear aria-hidden="true" />
            <time dateTime={task.deadline}>{formatDate(task.deadline)}</time>
          </p>

          <Link
            className={styles.detailLink}
            href={`/tasks/${task.id}`}
            aria-label={`${task.title} の詳細`}
          >
            <IoArrowForward aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
