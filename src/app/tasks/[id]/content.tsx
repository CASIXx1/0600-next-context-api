"use client";

import { useProjects } from "@/src/contexts/projects";
import { TaskDetailForm } from "@/src/components/tasks/TaskDetailForm";
import styles from "./content.module.css";

type TaskDetailContentProps = {
  taskId: string;
};

export function TaskDetailContent({ taskId }: TaskDetailContentProps) {
  const projects = useProjects();

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <TaskDetailForm
          projects={projects}
          taskId={taskId}
        />
      </div>
    </section>
  );
}
