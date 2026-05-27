"use client";

import Link from "next/link";
import { IoArrowForward } from "react-icons/io5";
import { useDashboardStats } from "@/src/contexts/dashboard";
import { useProjectsList } from "@/src/contexts/projects";
import { useTasksList } from "@/src/contexts/tasks";
import { ProjectCard } from "@/src/components/projects/ProjectCard";
import { ProgressChart } from "./components/ProgressChart";
import { TaskTable } from "./tasks/components/TaskTable";
import styles from "./page.module.css";

const DASHBOARD_PROJECTS_PAGE = 1;
const DASHBOARD_TASKS_LIMIT = 5;
const DASHBOARD_TASKS_PAGE = 1;

export function DashboardContent() {
  const { errorMessage: projectsErrorMessage, projects } = useProjectsList({
    requestedPage: DASHBOARD_PROJECTS_PAGE,
  });
  const { errorMessage: statsErrorMessage, stats } = useDashboardStats();
  const {
    errorMessage: tasksErrorMessage,
    isTasksLoaded,
    projects: taskProjects,
    tasks,
    updateTaskById,
  } = useTasksList({
    requestedLimit: DASHBOARD_TASKS_LIMIT,
    requestedPage: DASHBOARD_TASKS_PAGE,
  });
  const dashboardProjects = projects.slice(0, 3);
  const errorMessage = projectsErrorMessage ?? statsErrorMessage ?? tasksErrorMessage;

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        {errorMessage ? (
          <p
            className={styles.errorMessage}
            role="alert"
          >
            {errorMessage}
          </p>
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
              <Link
                className={styles.link}
                href="/tasks"
              >
                タスク一覧
                <IoArrowForward
                  className={styles.linkIcon}
                  aria-hidden="true"
                />
              </Link>
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
            <div className={styles.sectionFooter} />
          </section>
        </div>
      </div>
    </section>
  );
}
