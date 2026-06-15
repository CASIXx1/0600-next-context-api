"use client";

import { useState } from "react";
import { IoCaretDown } from "react-icons/io5";
import { Button } from "@/src/components/atoms/Button";
import { FormMessage } from "@/src/components/atoms/FormMessage";
import { TextInput } from "@/src/components/atoms/TextInput";
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
  const [formData, setFormData] = useState<CreateTaskFormData>(() => createInitialFormData());

  const updateFormData = <Key extends keyof CreateTaskFormData>(key: Key, value: CreateTaskFormData[Key]) => {
    setFormData((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <form
      className={styles.form}
      onSubmit={async (event) => {
        event.preventDefault();

        const isSuccess = await createTask(formData);

        if (isSuccess) {
          setFormData(createInitialFormData());
          onCreated();
        }
      }}
    >
      <h2 className={styles.title}>タスクを追加</h2>

      {errorMessage ? <FormMessage tone="error">{errorMessage}</FormMessage> : null}

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
            value={formData.projectId}
            required
            onChange={(event) => {
              updateFormData("projectId", event.target.value);
            }}
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
        <TextInput
          id="task-title"
          name="title"
          value={formData.title}
          placeholder="タスクを入力。例）英会話レッスンの予約、React公式ドキュメントを1ページ読む"
          required
          onChange={(event) => {
            updateFormData("title", event.target.value);
          }}
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
          value={formData.description}
          placeholder="タスクの説明・メモ"
          rows={6}
          onChange={(event) => {
            updateFormData("description", event.target.value);
          }}
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
          value={formData.deadline}
          required
          onChange={(event) => {
            updateFormData("deadline", event.target.value);
          }}
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
            value={formData.status}
            onChange={(event) => {
              updateFormData("status", toTaskStatus(event.target.value));
            }}
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
        <Button
          type="submit"
          variant="primary"
          disabled={isCreating}
        >
          {isCreating ? "作成中" : "作成"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={isCreating}
          onClick={onCancel}
        >
          キャンセル
        </Button>
      </div>
    </form>
  );
}

function createInitialFormData(): CreateTaskFormData {
  return {
    deadline: getDefaultDeadlineValue(),
    description: "",
    projectId: "",
    status: TASK_STATUS_OPTIONS[0].value,
    title: "",
  };
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
