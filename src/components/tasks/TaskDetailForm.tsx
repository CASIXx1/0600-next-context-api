"use client";

import Link from "next/link";
import { IoCaretDown, IoTrashOutline } from "react-icons/io5";
import type { Project } from "@/src/contexts/projects";
import styles from "./TaskDetailForm.module.css";

type TaskDetailFormProps = {
  projects: Project[];
  taskId: string;
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

const MOCK_CREATED_AT = "2026/06/04";
const MOCK_UPDATED_AT = "2026/06/04";
const MOCK_DEADLINE = "2026/06/18";

export function TaskDetailForm({ projects, taskId }: TaskDetailFormProps) {
  return (
    <article className={styles.detail}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{getTaskTitle(taskId)}</h1>
          <p className={styles.meta}>
            <span>作成日時: {MOCK_CREATED_AT}</span>
            <span>更新日時: {MOCK_UPDATED_AT}</span>
          </p>
        </div>

        <button
          className={styles.deleteButton}
          type="button"
          aria-label="タスクを削除"
        >
          <IoTrashOutline aria-hidden="true" />
        </button>
      </header>

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
              defaultValue=""
            >
              <option
                value=""
                disabled
              >
                プログラムを選択してください
              </option>
              {projects.map((project) => (
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
              defaultValue={MOCK_DEADLINE}
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
              defaultValue={TASK_STATUS_OPTIONS[0].value}
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

function getTaskTitle(taskId: string) {
  const numericPart = taskId.match(/\d+/)?.[0];

  return numericPart ? `タスク ${numericPart}` : "タスク 100";
}
