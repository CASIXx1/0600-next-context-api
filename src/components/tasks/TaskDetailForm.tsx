"use client";

import Link from "next/link";
import { useState } from "react";
import { IoCaretDown, IoTrashOutline } from "react-icons/io5";
import { useProjects } from "@/src/contexts/projects";
import { useTaskDetailContext, type Task } from "@/src/contexts/tasks";
import styles from "./TaskDetailForm.module.css";

type TaskDetailFormData = {
  deadline: string;
  description: string;
  projectId: string;
  status: Task["status"];
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
] as const satisfies ReadonlyArray<{
  label: string;
  value: Task["status"];
}>;

export function TaskDetailForm() {
  const { task } = useTaskDetailContext();

  if (!task) {
    return null;
  }

  return <TaskDetailFormFields key={`${task.id}-${task.updatedAt}`} />;
}

function TaskDetailFormFields() {
  const projects = useProjects();
  const {
    deleteErrorMessage,
    deleteTask,
    isDeleting,
    isUpdating,
    task,
    updateErrorMessage,
    updateSuccessMessage,
    updateTask,
  } = useTaskDetailContext();
  const [formData, setFormData] = useState<TaskDetailFormData>(() => createInitialFormData(task));
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const updateFormData = <Key extends keyof TaskDetailFormData>(key: Key, value: TaskDetailFormData[Key]) => {
    setFormData((current) => ({
      ...current,
      [key]: value,
    }));
  };

  if (!task) {
    return null;
  }

  const projectOptions = projects.length > 0 ? projects : [task.project];
  const errorMessage = deleteErrorMessage ?? updateErrorMessage;

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
          aria-expanded={isDeleteConfirmOpen}
          disabled={isDeleting || isUpdating}
          onClick={() => {
            setIsDeleteConfirmOpen(true);
          }}
        >
          <IoTrashOutline aria-hidden="true" />
        </button>
      </header>

      {isDeleteConfirmOpen ? (
        <div
          className={styles.deleteConfirm}
          role="group"
          aria-labelledby="delete-confirm-title"
          aria-describedby="delete-confirm-description"
        >
          <div>
            <h2
              className={styles.deleteConfirmTitle}
              id="delete-confirm-title"
            >
              タスクを削除しますか？
            </h2>
            <p
              className={styles.deleteConfirmDescription}
              id="delete-confirm-description"
            >
              「{task.title}」を削除します。この操作は取り消せません。
            </p>
          </div>
          <div className={styles.deleteConfirmActions}>
            <button
              className={styles.deleteConfirmButton}
              type="button"
              disabled={isDeleting}
              onClick={() => {
                void deleteTask();
              }}
            >
              削除する
            </button>
            <button
              className={styles.deleteCancelButton}
              type="button"
              disabled={isDeleting}
              onClick={() => {
                setIsDeleteConfirmOpen(false);
              }}
            >
              キャンセル
            </button>
          </div>
        </div>
      ) : null}

      {errorMessage ? (
        <p
          className={styles.errorMessage}
          role="alert"
        >
          {errorMessage}
        </p>
      ) : null}

      {updateSuccessMessage ? (
        <p
          className={styles.successMessage}
          role="status"
        >
          {updateSuccessMessage}
        </p>
      ) : null}

      <form
        className={styles.form}
        onSubmit={async (event) => {
          event.preventDefault();

          await updateTask({
            deadline: toDateInputValue(formData.deadline),
            description: formData.description,
            projectId: formData.projectId,
            status: formData.status,
          });
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
              name="projectId"
              value={formData.projectId}
              onChange={(event) => {
                updateFormData("projectId", event.target.value);
              }}
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
              name="deadline"
              type="text"
              value={formData.deadline}
              onChange={(event) => {
                updateFormData("deadline", event.target.value);
              }}
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
            name="description"
            value={formData.description}
            placeholder="タスクの説明・メモ"
            rows={6}
            onChange={(event) => {
              updateFormData("description", event.target.value);
            }}
          />
        </div>

        <div className={styles.actions}>
          <button
            className={styles.primaryButton}
            type="submit"
            disabled={isUpdating || isDeleting}
          >
            更新
          </button>
          <button
            className={styles.secondaryButton}
            type="button"
            disabled={isUpdating || isDeleting}
            onClick={() => {
              setFormData(createInitialFormData(task));
            }}
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

function createInitialFormData(task: Task | null): TaskDetailFormData {
  return {
    deadline: task ? formatDateForDisplay(task.deadline) : "",
    description: task?.description ?? "",
    projectId: task?.project.id ?? "",
    status: task?.status ?? TASK_STATUS_OPTIONS[0].value,
  };
}

function formatDateForDisplay(value: string) {
  if (!value) {
    return "";
  }

  return value.slice(0, 10).replaceAll("-", "/");
}

function toDateInputValue(value: string) {
  return value.replaceAll("/", "-");
}

function toTaskStatus(value: string): Task["status"] {
  return TASK_STATUS_OPTIONS.some((option) => option.value === value) ? (value as Task["status"]) : "scheduled";
}
