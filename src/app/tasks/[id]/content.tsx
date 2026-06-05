"use client";

import { useRouter } from "next/navigation";
import { useProjects } from "@/src/contexts/projects";
import { useDeleteTask } from "@/src/contexts/tasks";
import { TaskDetailForm } from "@/src/components/tasks/TaskDetailForm";
import styles from "./content.module.css";

type TaskDetailContentProps = {
  taskId: string;
};

export function TaskDetailContent({ taskId }: TaskDetailContentProps) {
  const router = useRouter();
  const projects = useProjects();
  const { deleteTask, errorMessage, isDeleting } = useDeleteTask();

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <TaskDetailForm
          deleteErrorMessage={errorMessage}
          isDeleting={isDeleting}
          projects={projects}
          taskId={taskId}
          onDelete={async () => {
            const isSuccess = await deleteTask(taskId);

            if (isSuccess) {
              router.push("/tasks");
            }
          }}
        />
      </div>
    </section>
  );
}
