"use client";

import Link from "next/link";
import { FormMessage } from "@/src/components/atoms/FormMessage";
import { ArrowTextLink } from "@/src/components/molecules/ArrowTextLink";
import { useProjectsList } from "@/src/contexts/projects";
import { useStats } from "@/src/contexts/stats";
import { useTasksList } from "@/src/contexts/tasks";
import { ProgressChart } from "@/src/components/progress/ProgressChart";
import { ProjectCard } from "@/src/components/projects/ProjectCard";
import { TaskTable } from "@/src/components/tasks/TaskTable";
import styles from "./content.module.css";

const DASHBOARD_PROJECTS_PAGE = 1;
const DASHBOARD_PROJECTS_LIMIT = 3;
const DASHBOARD_TASKS_PAGE = 1;
const DASHBOARD_TASKS_LIMIT = 20;

export function DashboardContent() {
  const { errorMessage: projectsErrorMessage, projects } = useProjectsList({
    requestedPage: DASHBOARD_PROJECTS_PAGE,
  });
  const { errorMessage: statsErrorMessage, stats } = useStats();
  const {
    errorMessage: tasksErrorMessage,
    isTasksLoaded,
    pageCount: tasksPageCount,
    pageInfo: tasksPageInfo,
    projects: taskProjects,
    tasks,
    updateTaskById,
  } = useTasksList({
    requestedLimit: DASHBOARD_TASKS_LIMIT,
    requestedPage: DASHBOARD_TASKS_PAGE,
  });
  const dashboardProjects = projects.slice(0, DASHBOARD_PROJECTS_LIMIT);
  const errorMessage = projectsErrorMessage ?? statsErrorMessage ?? tasksErrorMessage;
  const remainingTasksPageCount = Math.max(0, tasksPageCount - tasksPageInfo.page);

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        {errorMessage ? (
          <FormMessage
            className={styles.errorMessage}
            tone="error"
          >
            {errorMessage}
          </FormMessage>
        ) : null}

        <div className={styles.projects}>
          <div className={styles.dashboard}>
            <section className={styles.projectList}>
              <h2 className={styles.sectionTitle}>プロジェクト</h2>

              <div className={styles.sectionContent}>
                {dashboardProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                  />
                ))}
              </div>

              <div className={styles.projectListFooter}>
                <Link
                  className={styles.projectListLink}
                  href="/projects"
                >
                  プロジェクト一覧
                </Link>
              </div>
            </section>

            <section className={styles.chart}>
              <h2 className={styles.sectionTitle}>進捗</h2>

              <div className={styles.sectionContent}>
                <ProgressChart stats={stats} />
              </div>
            </section>
          </div>

          <section className={styles.todos}>
            <header className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>タスク</h2>
              <ArrowTextLink href="/tasks">タスク一覧</ArrowTextLink>
            </header>

            <div className={styles.sectionContent}>
              {isTasksLoaded ? (
                <TaskTable
                  projects={taskProjects}
                  tasks={tasks}
                  updateTaskById={updateTaskById}
                />
              ) : null}
            </div>
            <div className={styles.sectionFooter}>
              {remainingTasksPageCount > 0 ? (
                <ArrowTextLink href="/tasks">あと {remainingTasksPageCount} ページ</ArrowTextLink>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
