"use client";

import { IoCaretDown } from "react-icons/io5";
import type { Project } from "@/src/contexts/projects";
import styles from "./TaskCreateForm.module.css";

type TaskCreateFormProps = {
  onCancel: () => void;
  projects: Project[];
};

const DEFAULT_DEADLINE_OFFSET_DAYS = 7;
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

export function TaskCreateForm({ onCancel, projects }: TaskCreateFormProps) {
  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <h2 className={styles.title}>タスクを追加</h2>

      <div className={styles.field}>
        <label
          className={`${styles.label} ${styles.required}`}
          htmlFor="task-project"
        >
          プロジェクト
        </label>
        <div className={styles.selectContainer}>
          <select
            className={styles.select}
            id="task-project"
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
          htmlFor="task-title"
        >
          タスク
        </label>
        <input
          className={styles.input}
          id="task-title"
          type="text"
          placeholder="タスクを入力。例）英会話レッスンの予約、React公式ドキュメントを1ページ読む"
        />
      </div>

      <div className={styles.field}>
        <label
          className={styles.label}
          htmlFor="task-description"
        >
          説明・メモ
        </label>
        <textarea
          className={styles.textarea}
          id="task-description"
          placeholder="タスクの説明・メモ"
          rows={6}
        />
      </div>

      <div className={styles.field}>
        <label
          className={`${styles.label} ${styles.required}`}
          htmlFor="task-deadline"
        >
          締切日
        </label>
        <input
          className={`${styles.input} ${styles.dateInput}`}
          id="task-deadline"
          type="date"
          defaultValue={getDefaultDeadlineValue()}
        />
      </div>

      <div className={styles.field}>
        <label
          className={styles.label}
          htmlFor="task-status"
        >
          ステータス
        </label>
        <div className={styles.selectContainer}>
          <select
            className={styles.select}
            id="task-status"
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

      <div className={styles.actions}>
        <button
          className={styles.primaryButton}
          type="submit"
        >
          作成
        </button>
        <button
          className={styles.secondaryButton}
          type="button"
          onClick={onCancel}
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}

function getDefaultDeadlineValue() {
  const date = new Date();
  date.setDate(date.getDate() + DEFAULT_DEADLINE_OFFSET_DAYS);

  return date.toISOString().slice(0, 10);
}
