"use client";

import { useRouter } from "next/navigation";
import { useProjects } from "@/src/contexts/projects";
import { useDeleteTask, useTaskDetail } from "@/src/contexts/tasks";
import { TaskDetailForm } from "@/src/components/tasks/TaskDetailForm";
import styles from "./content.module.css";

type TaskDetailContentProps = {
  taskId: string;
};

export function TaskDetailContent({ taskId }: TaskDetailContentProps) {
  const router = useRouter();
  const projects = useProjects();
  const { deleteTask, errorMessage, isDeleting } = useDeleteTask();
  const {
    errorMessage: taskErrorMessage,
    isTaskLoaded,
    task,
  } = useTaskDetail({
    taskId,
  });

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        {!isTaskLoaded ? <p className={styles.statePanel}>読み込み中...</p> : null}

        {taskErrorMessage ? (
          <p
            className={`${styles.statePanel} ${styles.errorPanel}`}
            role="alert"
          >
            {taskErrorMessage}
          </p>
        ) : null}

        {isTaskLoaded && !task && !taskErrorMessage ? (
          <p
            className={styles.statePanel}
            role="status"
          >
            タスクが見つかりませんでした。
          </p>
        ) : null}

        {isTaskLoaded && task ? (
          <TaskDetailForm
            deleteErrorMessage={errorMessage}
            isDeleting={isDeleting}
            projects={projects}
            task={task}
            onDelete={async () => {
              const isSuccess = await deleteTask(task.id);

              if (isSuccess) {
                router.replace("/tasks");
              }
            }}
          />
        ) : null}
      </div>
    </section>
  );
}
