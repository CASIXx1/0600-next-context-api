"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TaskDetailProvider, useDeleteTask, useTaskDetail } from "@/src/contexts/tasks";
import { TaskDetailForm } from "@/src/components/organisms/tasks/TaskDetailForm";
import styles from "./content.module.css";

type TaskDetailContentProps = {
  taskId: string;
};

export function TaskDetailContent({ taskId }: TaskDetailContentProps) {
  const router = useRouter();
  const { deleteTask, errorMessage, isDeleting } = useDeleteTask();
  const taskDetailState = useTaskDetail({
    taskId,
  });
  const { errorMessage: taskErrorMessage, isTaskLoaded, task } = taskDetailState;
  const deleteCurrentTask = useCallback(async () => {
    if (!task) {
      return;
    }

    const isSuccess = await deleteTask(task.id);

    if (isSuccess) {
      router.replace("/tasks");
    }
  }, [deleteTask, router, task]);
  const taskDetailContextValue = useMemo(
    () => ({
      ...taskDetailState,
      deleteErrorMessage: errorMessage,
      deleteTask: deleteCurrentTask,
      isDeleting,
    }),
    [deleteCurrentTask, errorMessage, isDeleting, taskDetailState],
  );

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
          <TaskDetailProvider value={taskDetailContextValue}>
            <TaskDetailForm />
          </TaskDetailProvider>
        ) : null}
      </div>
    </section>
  );
}
