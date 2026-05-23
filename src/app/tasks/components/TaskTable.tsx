import { TaskRow } from "./TaskRow";
import type { Project, Task, UpdateTaskData } from "@/src/contexts/tasks";
import styles from "./TaskTable.module.css";

type TaskTableProps = {
  projects: Project[];
  tasks: Task[];
  updateTaskById: (taskId: string, data: UpdateTaskData) => Promise<void>;
};

export function TaskTable({ projects, tasks, updateTaskById }: TaskTableProps) {
  return (
    <div className={styles.table}>
      <div className={styles.tableHeader}>
        <div className={`${styles.tableHeaderCell} ${styles.titleCell}`}>タスク</div>
        <div className={`${styles.tableHeaderCell} ${styles.projectCell}`}>プロジェクト</div>
        <div className={`${styles.tableHeaderCell} ${styles.statusHeaderCell}`}>ステータス</div>
        <div className={styles.tableHeaderCell}>期限日</div>
        <div className={`${styles.tableHeaderCell} ${styles.detailCell}`} />
      </div>

      <div>
        {tasks.length === 0 ? (
          <div className={styles.tableRow}>
            <div className={styles.empty}>タスクが登録されていません</div>
          </div>
        ) : null}

        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            projects={projects}
            task={task}
            updateTaskById={updateTaskById}
          />
        ))}
      </div>
    </div>
  );
}
