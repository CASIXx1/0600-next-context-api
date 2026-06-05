"use client";

import { IoCaretDown } from "react-icons/io5";
import { useProjects } from "@/src/contexts/projects";
import { useCreateTask, type CreateTaskFormData } from "@/src/contexts/tasks";
import styles from "./TaskCreateForm.module.css";

type TaskCreateFormProps = {
  onCancel: () => void;
  onCreated: () => void;
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
] as const satisfies ReadonlyArray<{
  label: string;
  value: CreateTaskFormData["status"];
}>;

export function TaskCreateForm({ onCancel, onCreated }: TaskCreateFormProps) {
  const projects = useProjects();
  const { createTask, errorMessage, isCreating } = useCreateTask();

  return (
    <form
      className={styles.form}
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const isSuccess = await createTask({
          deadline: String(formData.get("deadline") ?? ""),
          description: String(formData.get("description") ?? ""),
          projectId: String(formData.get("projectId") ?? ""),
          status: toTaskStatus(String(formData.get("status") ?? "")),
          title: String(formData.get("title") ?? ""),
        });

        if (isSuccess) {
          onCreated();
        }
      }}
    >
      <h2 className={styles.title}>タスクを追加</h2>

      {errorMessage ? (
        <p
          className={styles.errorMessage}
          role="alert"
        >
          {errorMessage}
        </p>
      ) : null}

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
            name="projectId"
            defaultValue=""
            required
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
          name="title"
          type="text"
          placeholder="タスクを入力。例）英会話レッスンの予約、React公式ドキュメントを1ページ読む"
          required
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
          name="description"
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
          name="deadline"
          type="date"
          defaultValue={getDefaultDeadlineValue()}
          required
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
            name="status"
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
          disabled={isCreating}
        >
          {isCreating ? "作成中" : "作成"}
        </button>
        <button
          className={styles.secondaryButton}
          type="button"
          disabled={isCreating}
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
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function toTaskStatus(value: string): CreateTaskFormData["status"] {
  return TASK_STATUS_OPTIONS.some((option) => option.value === value)
    ? (value as CreateTaskFormData["status"])
    : "scheduled";
}
