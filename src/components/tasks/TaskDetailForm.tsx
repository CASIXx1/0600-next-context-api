"use client";

import Link from "next/link";
import { useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { Button } from "@/src/components/atoms/Button";
import { FormMessage } from "@/src/components/atoms/FormMessage";
import { IconButton } from "@/src/components/atoms/IconButton";
import { Select } from "@/src/components/atoms/Select";
import { Textarea } from "@/src/components/atoms/Textarea";
import { TextInput } from "@/src/components/atoms/TextInput";
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

        <IconButton
          ariaLabel="タスクを削除"
          ariaExpanded={isDeleteConfirmOpen}
          disabled={isDeleting || isUpdating}
          onClick={() => {
            setIsDeleteConfirmOpen(true);
          }}
        >
          <IoTrashOutline aria-hidden="true" />
        </IconButton>
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
            <Button
              className={styles.deleteConfirmButton}
              type="button"
              variant="danger"
              size="small"
              disabled={isDeleting}
              onClick={() => {
                void deleteTask();
              }}
            >
              削除する
            </Button>
            <Button
              className={styles.deleteCancelButton}
              type="button"
              variant="secondary"
              size="small"
              disabled={isDeleting}
              onClick={() => {
                setIsDeleteConfirmOpen(false);
              }}
            >
              キャンセル
            </Button>
          </div>
        </div>
      ) : null}

      {errorMessage ? <FormMessage tone="error">{errorMessage}</FormMessage> : null}

      {updateSuccessMessage ? <FormMessage tone="success">{updateSuccessMessage}</FormMessage> : null}

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
          <Select
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
          </Select>
        </div>

        <div className={styles.field}>
          <label
            className={`${styles.label} ${styles.required}`}
            htmlFor="detail-deadline"
          >
            締切日
          </label>
          <div className={styles.dateInputContainer}>
            <TextInput
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
          <Select
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
          </Select>
        </div>

        <div className={styles.field}>
          <label
            className={styles.label}
            htmlFor="detail-description"
          >
            説明・メモ
          </label>
          <Textarea
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
          <Button
            type="submit"
            variant="primary"
            disabled={isUpdating || isDeleting}
          >
            更新
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={isUpdating || isDeleting}
            onClick={() => {
              setFormData(createInitialFormData(task));
            }}
          >
            リセット
          </Button>
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
