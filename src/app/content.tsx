"use client";

import Link from "next/link";
import { IoArrowForward } from "react-icons/io5";
import { useProjectsList } from "@/src/contexts/projects";
import { useTasksList } from "@/src/contexts/tasks";
import { ProjectCard } from "@/src/components/projects/ProjectCard";
import { DashboardStatList } from "./components/DashboardStatList";
import { DashboardTaskList } from "./components/DashboardTaskList";
import styles from "./page.module.css";

const DASHBOARD_PROJECTS_PAGE = 1;
const DASHBOARD_TASKS_LIMIT = 5;
const DASHBOARD_TASKS_PAGE = 1;

export function DashboardContent() {
  const {
    errorMessage: projectsErrorMessage,
    pageInfo: projectsPageInfo,
    projects,
  } = useProjectsList({
    requestedPage: DASHBOARD_PROJECTS_PAGE,
  });
  const {
    errorMessage: tasksErrorMessage,
    isTasksLoaded,
    pageInfo: tasksPageInfo,
    tasks,
  } = useTasksList({
    requestedLimit: DASHBOARD_TASKS_LIMIT,
    requestedPage: DASHBOARD_TASKS_PAGE,
  });
  const dashboardProjects = projects.slice(0, 3);
  const visibleMilestonesCount = projects.reduce((total, project) => total + project.stats.kinds.milestone, 0);
  const visibleTasksCount = projects.reduce((total, project) => total + project.stats.kinds.task, 0);
  const errorMessage = projectsErrorMessage ?? tasksErrorMessage;

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>ダッシュボード</h1>
            <p className={styles.subtitle}>進行中のタスクとプロジェクトを確認できます。</p>
          </div>
        </header>

        {errorMessage ? (
          <p
            className={styles.errorMessage}
            role="alert"
          >
            {errorMessage}
          </p>
        ) : null}

        <DashboardStatList
          stats={[
            {
              label: "プロジェクト",
              value: projectsPageInfo.totalCount,
            },
            {
              label: "未完了タスク",
              value: tasksPageInfo.totalCount,
            },
            {
              label: "表示中マイルストーン",
              value: visibleMilestonesCount,
            },
            {
              label: "表示中タスク",
              value: visibleTasksCount,
            },
          ]}
        />

        <div className={styles.grid}>
          <section className={styles.panel}>
            <header className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>未完了タスク</h2>
              <Link
                className={styles.panelLink}
                href="/tasks"
              >
                すべて見る
                <IoArrowForward aria-hidden="true" />
              </Link>
            </header>

            {isTasksLoaded ? <DashboardTaskList tasks={tasks} /> : null}
          </section>

          <section className={styles.panel}>
            <header className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>プロジェクト</h2>
              <Link
                className={styles.panelLink}
                href="/projects"
              >
                すべて見る
                <IoArrowForward aria-hidden="true" />
              </Link>
            </header>

            <ul className={styles.projectList}>
              {dashboardProjects.map((project) => (
                <li key={project.id}>
                  <ProjectCard project={project} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </section>
  );
}
