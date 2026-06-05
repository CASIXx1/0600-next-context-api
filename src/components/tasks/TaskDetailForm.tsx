"use client";

import Link from "next/link";
import { IoCaretDown, IoTrashOutline } from "react-icons/io5";
import type { Project } from "@/src/contexts/projects";
import type { Task } from "@/src/contexts/tasks";
import styles from "./TaskDetailForm.module.css";

type TaskDetailFormProps = {
  deleteErrorMessage: string | null;
  isDeleting: boolean;
  onDelete: () => Promise<void>;
  projects: Project[];
  task: Task;
};

const TASK_STATUS_OPTIONS = [
  {
    label: "未完了",
    value: "scheduled",
  },
  {
    label: "完了",
    value: "completed",
  },
  {
    label: "アーカイブ",
    value: "archived",
  },
] as const;

export function TaskDetailForm({ deleteErrorMessage, isDeleting, onDelete, projects, task }: TaskDetailFormProps) {
  const projectOptions = projects.length > 0 ? projects : [task.project];

  return (
    <article className={styles.detail}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{task.title}</h1>
          <p className={styles.meta}>
            <span>作成日時: {formatDateForDisplay(task.createdAt)}</span>
            <span>更新日時: {formatDateForDisplay(task.updatedAt)}</span>
          </p>
        </div>

        <button
          className={styles.deleteButton}
          type="button"
          aria-label="タスクを削除"
          disabled={isDeleting}
          onClick={() => {
            void onDelete();
          }}
        >
          <IoTrashOutline aria-hidden="true" />
        </button>
      </header>

      {deleteErrorMessage ? (
        <p
          className={styles.errorMessage}
          role="alert"
        >
          {deleteErrorMessage}
        </p>
      ) : null}

      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <div className={styles.field}>
          <label
            className={`${styles.label} ${styles.required}`}
            htmlFor="detail-project"
          >
            プロジェクト
          </label>
          <div className={styles.selectContainer}>
            <select
              className={styles.select}
              id="detail-project"
              defaultValue={task.project.id}
            >
              {projectOptions.map((project) => (
                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.name}
                </option>
              ))}
            </select>
            <IoCaretDown
              className={styles.selectIcon}
              aria-hidden="true"
            />
          </div>
        </div>

        <div className={styles.field}>
          <label
            className={`${styles.label} ${styles.required}`}
            htmlFor="detail-deadline"
          >
            締切日
          </label>
          <div className={styles.dateInputContainer}>
            <input
              className={styles.input}
              id="detail-deadline"
              type="text"
              defaultValue={formatDateForDisplay(task.deadline)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label
            className={styles.label}
            htmlFor="detail-status"
          >
            ステータス
          </label>
          <div className={styles.selectContainer}>
            <select
              className={styles.select}
              id="detail-status"
              defaultValue={task.status}
            >
              {TASK_STATUS_OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
            <IoCaretDown
              className={styles.selectIcon}
              aria-hidden="true"
            />
          </div>
        </div>

        <div className={styles.field}>
          <label
            className={styles.label}
            htmlFor="detail-description"
          >
            説明・メモ
          </label>
          <textarea
            className={styles.textarea}
            id="detail-description"
            defaultValue={task.description}
            placeholder="タスクの説明・メモ"
            rows={6}
          />
        </div>

        <div className={styles.actions}>
          <button
            className={styles.primaryButton}
            type="submit"
          >
            更新
          </button>
          <button
            className={styles.secondaryButton}
            type="reset"
          >
            リセット
          </button>
        </div>
      </form>

      <Link
        className={styles.backLink}
        href="/tasks"
      >
        ←戻る
      </Link>
    </article>
  );
}

function formatDateForDisplay(value: string) {
  if (!value) {
    return "";
  }

  return value.slice(0, 10).replaceAll("-", "/");
}
