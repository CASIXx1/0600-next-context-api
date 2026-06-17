"use client";

import { IoArrowForward } from "react-icons/io5";
import { CircleIconLink } from "@/src/components/atoms/CircleIconLink";
import { EditableField } from "@/src/components/molecules/EditableField";
import { TaskSelect, type SelectOption } from "@/src/components/molecules/TaskSelect";
import type { Project, Task, UpdateTaskData } from "@/src/contexts/tasks";
import styles from "./TaskRow.module.css";

const STATUS_OPTIONS = [
  { label: "未完了", value: "scheduled" },
  { label: "完了", value: "completed" },
  { label: "アーカイブ済み", value: "archived" },
] as const;

type TaskRowProps = {
  isSelectOpen: boolean;
  onSelectOpenChange: (isOpen: boolean) => void;
  projects: Project[];
  task: Task;
  updateTaskById: (taskId: string, data: UpdateTaskData) => Promise<void>;
};

export function TaskRow({ isSelectOpen, onSelectOpenChange, projects, task, updateTaskById }: TaskRowProps) {
  const projectOptions = projects.length > 0 ? projects.map(toSelectOption) : [toSelectOption(task.project)];
  const handleTaskUpdate = (data: UpdateTaskData) => {
    void updateTaskById(task.id, data);
  };

  return (
    <div className={`${styles.tableRow} ${isSelectOpen ? styles.tableRowOpen : ""}`}>
      <div className={`${styles.tableCell} ${styles.titleCell}`}>
        <EditableField
          defaultValue={task.title}
          label="タスク名"
          onCommit={(title) => {
            const nextTitle = title.trim();

            if (nextTitle && nextTitle !== task.title) {
              handleTaskUpdate({ title: nextTitle });
            }
          }}
        />
      </div>

      <div className={`${styles.tableCell} ${styles.projectCell}`}>
        <TaskSelect
          label={`${task.title} のプロジェクト`}
          options={projectOptions}
          value={task.project.id}
          onOpenChange={onSelectOpenChange}
          onSelect={(projectId) => {
            const project = projects.find((item) => item.id === projectId);

            if (!project) {
              return;
            }

            if (project.id !== task.project.id) {
              handleTaskUpdate({ projectId: project.id });
            }
          }}
        />
      </div>

      <div className={`${styles.tableCell} ${styles.statusCell}`}>
        <TaskSelect
          label={`${task.title} のステータス`}
          options={STATUS_OPTIONS}
          value={task.status}
          onOpenChange={onSelectOpenChange}
          onSelect={(value) => {
            const status = value as Task["status"];

            if (status !== task.status) {
              handleTaskUpdate({ status });
            }
          }}
        />
      </div>

      <div className={styles.tableCell}>
        <EditableField
          defaultValue={formatDateForDisplay(task.deadline)}
          inputValue={toDateInputValue(task.deadline)}
          label={`${task.title} の期限日`}
          type="date"
          onCommit={(deadline) => {
            if (!deadline || deadline === toDateInputValue(task.deadline)) {
              return;
            }

            handleTaskUpdate({ deadline });
          }}
        />
      </div>

      <div className={`${styles.tableCell} ${styles.detailCell}`}>
        <CircleIconLink
          href={`/tasks/${task.id}`}
          ariaLabel={`${task.title} の詳細`}
        >
          <IoArrowForward aria-hidden="true" />
        </CircleIconLink>
      </div>
    </div>
  );
}

function formatDateForDisplay(value: string) {
  return toDateInputValue(value).replaceAll("-", "/");
}

function toDateInputValue(value: string) {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
}

function toSelectOption(project: Project): SelectOption {
  return {
    label: project.name,
    value: project.id,
  };
}
