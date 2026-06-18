"use client";

import { useState } from "react";
import { TableHeader, type TableHeaderColumn } from "@/src/components/molecules/TableHeader";
import { TaskRow } from "./TaskRow";
import type { Project, Task, UpdateTaskData } from "@/src/contexts/tasks";
import styles from "./TaskTable.module.css";

type TaskTableProps = {
  projects: Project[];
  tasks: Task[];
  updateTaskById: (taskId: string, data: UpdateTaskData) => Promise<void>;
};

const TASK_TABLE_COLUMNS = [
  { label: "タスク", className: styles.titleCell },
  { label: "プロジェクト", className: styles.projectCell },
  { label: "ステータス", className: styles.statusHeaderCell },
  { label: "期限日" },
  { className: styles.detailCell },
] satisfies readonly TableHeaderColumn[];

export function TaskTable({ projects, tasks, updateTaskById }: TaskTableProps) {
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);

  return (
    <div className={styles.table}>
      <TableHeader columns={TASK_TABLE_COLUMNS} />

      <div>
        {tasks.length === 0 ? (
          <div className={styles.tableRow}>
            <div className={styles.empty}>タスクが登録されていません</div>
          </div>
        ) : null}

        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            isSelectOpen={openTaskId === task.id}
            projects={projects}
            task={task}
            onSelectOpenChange={(isOpen) => {
              setOpenTaskId(isOpen ? task.id : null);
            }}
            updateTaskById={updateTaskById}
          />
        ))}
      </div>
    </div>
  );
}
