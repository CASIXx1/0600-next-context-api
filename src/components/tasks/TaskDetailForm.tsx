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
import { ConfirmPanel } from "@/src/components/molecules/ConfirmPanel";
import { FormField } from "@/src/components/molecules/FormField";
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

  const projectOptions = (projects.length > 0 ? projects : [task.project]).map((project) => ({
    label: project.name,
    value: project.id,
  }));
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
        <ConfirmPanel
          titleId="delete-confirm-title"
          descriptionId="delete-confirm-description"
          title="タスクを削除しますか？"
          description={`「${task.title}」を削除します。この操作は取り消せません。`}
          confirmLabel="削除する"
          cancelLabel="キャンセル"
          disabled={isDeleting}
          onConfirm={() => {
            void deleteTask();
          }}
          onCancel={() => {
            setIsDeleteConfirmOpen(false);
          }}
        />
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
        <FormField
          htmlFor="detail-project"
          label="プロジェクト"
          required
        >
          <Select
            id="detail-project"
            name="projectId"
            value={formData.projectId}
            options={projectOptions}
            onChange={(event) => {
              updateFormData("projectId", event.target.value);
            }}
          />
        </FormField>

        <FormField
          htmlFor="detail-deadline"
          label="締切日"
          required
        >
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
        </FormField>

        <FormField
          htmlFor="detail-status"
          label="ステータス"
        >
          <Select
            id="detail-status"
            name="status"
            value={formData.status}
            options={TASK_STATUS_OPTIONS}
            onChange={(event) => {
              updateFormData("status", toTaskStatus(event.target.value));
            }}
          />
        </FormField>

        <FormField
          htmlFor="detail-description"
          label="説明・メモ"
        >
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
        </FormField>

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
