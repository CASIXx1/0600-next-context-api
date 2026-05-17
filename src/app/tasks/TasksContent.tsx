"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { IoChevronBack, IoChevronForward, IoArrowForward } from "react-icons/io5";
import styles from "./page.module.css";

type Project = {
  id: string;
  name: string;
};

type Task = {
  id: string;
  title: string;
  status: "scheduled" | "completed" | "archived";
  deadline: string;
  project: Project;
};

type PageInfo = {
  page: number;
  limit: number;
  totalCount: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
};

type TasksResponse = {
  data: Task[];
  pageInfo: PageInfo;
};

type ProjectsResponse = {
  data: Project[];
};

type TasksContentProps = {
  requestedPage: number;
};

const INITIAL_PAGE_LIMIT = 20;

const STATUS_OPTIONS = [
  { label: "未完了", value: "scheduled" },
  { label: "完了", value: "completed" },
  { label: "アーカイブ済み", value: "archived" },
] as const;

export function TasksContent({ requestedPage }: TasksContentProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>(() => createInitialPageInfo(requestedPage, INITIAL_PAGE_LIMIT));
  const [limit, setLimit] = useState(INITIAL_PAGE_LIMIT);

  useEffect(() => {
    let isActive = true;

    fetchProjects()
      .then((data) => {
        if (isActive) {
          setProjects(data);
        }
      })
      .catch(() => {
        if (isActive) {
          setProjects([]);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    fetchTasks(requestedPage, limit)
      .then(({ data, pageInfo: responsePageInfo }) => {
        if (!isActive) {
          return;
        }

        setTasks(data);
        setPageInfo(responsePageInfo);
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        setTasks([]);
        setPageInfo(createInitialPageInfo(requestedPage, limit));
      });

    return () => {
      isActive = false;
    };
  }, [limit, requestedPage]);

  const pageCount = useMemo(() => {
    return Math.max(1, Math.ceil(pageInfo.totalCount / pageInfo.limit));
  }, [pageInfo.limit, pageInfo.totalCount]);

  const handleTaskChange = (taskId: string, changes: Partial<Task>) => {
    setTasks((currentTasks) => currentTasks.map((task) => (task.id === taskId ? { ...task, ...changes } : task)));
  };

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <header>
          <h2 className={styles.title}>タスク</h2>
        </header>

        <div className={styles.tasks}>
          <div className={styles.listHeader}>
            <div className={styles.number}>
              <div className={styles.pageIndex}>
                <span>
                  {pageInfo.page} / {pageCount}
                </span>
              </div>

              <div className={styles.displayPageCount}>
                <label htmlFor="task-limit">表示件数 : </label>
                <select
                  id="task-limit"
                  className={styles.select}
                  value={limit}
                  onChange={(event) => {
                    setLimit(Number(event.target.value));
                  }}
                >
                  <option value="20">20 件</option>
                  <option value="50">50 件</option>
                  <option value="100">100 件</option>
                </select>
              </div>

              <div>
                <span className={styles.total}>{pageInfo.totalCount} 件</span>
              </div>
            </div>
          </div>

          <TaskTable
            onTaskChange={handleTaskChange}
            projects={projects}
            tasks={tasks}
          />

          <footer className={styles.footer}>
            <Pagination
              page={pageInfo.page}
              pageCount={pageCount}
            />
          </footer>
        </div>
      </div>
    </section>
  );
}

function TaskTable({
  onTaskChange,
  projects,
  tasks,
}: {
  onTaskChange: (taskId: string, changes: Partial<Task>) => void;
  projects: Project[];
  tasks: Task[];
}) {
  return (
    <div className={styles.table}>
      <div className={styles.tableHeader}>
        <div className={`${styles.tableHeaderCell} ${styles.titleCell}`}>タスク</div>
        <div className={`${styles.tableHeaderCell} ${styles.projectCell}`}>プロジェクト</div>
        <div className={`${styles.tableHeaderCell} ${styles.statusHeaderCell}`}>ステータス</div>
        <div className={styles.tableHeaderCell}>期限日</div>
        <div className={`${styles.tableHeaderCell} ${styles.detailCell}`} />
      </div>

      <div>
        {tasks.length === 0 ? <div className={styles.empty}>タスクが登録されていません</div> : null}

        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            onTaskChange={onTaskChange}
            projects={projects}
            task={task}
          />
        ))}
      </div>
    </div>
  );
}

function TaskRow({
  onTaskChange,
  projects,
  task,
}: {
  onTaskChange: (taskId: string, changes: Partial<Task>) => void;
  projects: Project[];
  task: Task;
}) {
  return (
    <div className={styles.tableRow}>
      <div className={`${styles.tableCell} ${styles.titleCell}`}>
        <input
          className={styles.field}
          aria-label="タスク名"
          defaultValue={task.title}
          onBlur={(event) => {
            const title = event.target.value;

            if (title && title !== task.title) {
              onTaskChange(task.id, { title });
              updateTask(task.id, { title }).catch(() => {
                onTaskChange(task.id, { title: task.title });
              });
            }
          }}
        />
      </div>

      <div className={`${styles.tableCell} ${styles.projectCell}`}>
        <select
          className={styles.selector}
          value={task.project.id}
          aria-label={`${task.title} のプロジェクト`}
          onChange={(event) => {
            const project = projects.find((item) => item.id === event.target.value);

            if (!project) {
              return;
            }

            onTaskChange(task.id, { project });
            updateTask(task.id, { projectId: project.id }).catch(() => {
              onTaskChange(task.id, { project: task.project });
            });
          }}
        >
          {projects.length === 0 ? <option value={task.project.id}>{task.project.name}</option> : null}
          {projects.map((project) => (
            <option
              key={project.id}
              value={project.id}
            >
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div className={`${styles.tableCell} ${styles.statusCell}`}>
        <select
          className={styles.selector}
          value={task.status}
          aria-label={`${task.title} のステータス`}
          onChange={(event) => {
            const status = event.target.value as Task["status"];

            onTaskChange(task.id, { status });
            updateTask(task.id, { status }).catch(() => {
              onTaskChange(task.id, { status: task.status });
            });
          }}
        >
          {STATUS_OPTIONS.map((status) => (
            <option
              key={status.value}
              value={status.value}
            >
              {status.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.tableCell}>
        <input
          className={styles.field}
          type="date"
          aria-label={`${task.title} の期限日`}
          value={toDateInputValue(task.deadline)}
          onChange={(event) => {
            const deadline = event.target.value;

            onTaskChange(task.id, { deadline });
            updateTask(task.id, { deadline }).catch(() => {
              onTaskChange(task.id, { deadline: task.deadline });
            });
          }}
        />
      </div>

      <div className={`${styles.tableCell} ${styles.detailCell}`}>
        <Link
          className={styles.detailCircle}
          href={`/tasks/${task.id}`}
          aria-label={`${task.title} の詳細`}
        >
          <IoArrowForward
            className={styles.detailIcon}
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  );
}

function Pagination({ page, pageCount }: { page: number; pageCount: number }) {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <ul className={styles.pagination}>
      <li>
        <Link
          className={styles.pageButton}
          href={`/tasks?page=${Math.max(1, page - 1)}`}
          aria-label="前のページ"
          aria-disabled={page <= 1}
        >
          <IoChevronBack aria-hidden="true" />
        </Link>
      </li>

      {pages.map((pageNumber) => (
        <li key={pageNumber}>
          <Link
            className={`${styles.pageButton} ${pageNumber === page ? styles.activePage : ""}`}
            href={`/tasks?page=${pageNumber}`}
            aria-current={pageNumber === page ? "page" : undefined}
          >
            {pageNumber}
          </Link>
        </li>
      ))}

      <li>
        <Link
          className={styles.pageButton}
          href={`/tasks?page=${Math.min(pageCount, page + 1)}`}
          aria-label="次のページ"
          aria-disabled={page >= pageCount}
        >
          <IoChevronForward aria-hidden="true" />
        </Link>
      </li>
    </ul>
  );
}

async function fetchTasks(page: number, limit: number): Promise<TasksResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    status: "scheduled",
  });
  const response = await fetch(`/api/v1/users/tasks?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return response.json();
}

async function fetchProjects(): Promise<Project[]> {
  const response = await fetch("/api/v1/users/projects?limit=100");

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  const { data }: ProjectsResponse = await response.json();
  return data;
}

async function updateTask(taskId: string, data: Record<string, string>) {
  const response = await fetch(`/api/v1/users/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update task");
  }
}

function createInitialPageInfo(page: number, limit: number): PageInfo {
  return {
    totalCount: 0,
    page,
    limit,
  };
}

function toDateInputValue(value: string) {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
}
