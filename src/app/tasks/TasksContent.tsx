"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoArrowForward, IoCaretDown, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useTasksList, type Project, type Task, type UpdateTaskData } from "@/src/contexts/tasks";
import styles from "./page.module.css";

type TasksContentProps = {
  requestedLimit: number;
  requestedPage: number;
};

const INITIAL_PAGE_LIMIT = 20;

const STATUS_OPTIONS = [
  { label: "未完了", value: "scheduled" },
  { label: "完了", value: "completed" },
  { label: "アーカイブ済み", value: "archived" },
] as const;

type SelectOption = {
  label: string;
  value: string;
};

export function TasksContent({ requestedLimit, requestedPage }: TasksContentProps) {
  const router = useRouter();
  const { errorMessage, isTasksLoaded, limit, pageCount, pageInfo, projects, setLimit, tasks, updateTaskById } =
    useTasksList({
      requestedLimit,
      requestedPage,
    });

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <header>
          <h2 className={styles.title}>タスク</h2>
        </header>

        {isTasksLoaded ? (
          <div className={styles.tasks}>
            {errorMessage ? (
              <p
                className={styles.errorMessage}
                role="alert"
              >
                {errorMessage}
              </p>
            ) : null}

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
                      const nextLimit = Number(event.target.value);

                      setLimit(nextLimit);
                      router.replace(createTasksPageHref(1, nextLimit));
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
              projects={projects}
              tasks={tasks}
              updateTaskById={updateTaskById}
            />

            <footer className={styles.footer}>
              <Pagination
                limit={limit}
                page={pageInfo.page}
                pageCount={pageCount}
              />
            </footer>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function TaskTable({
  projects,
  tasks,
  updateTaskById,
}: {
  projects: Project[];
  tasks: Task[];
  updateTaskById: (taskId: string, data: UpdateTaskData) => Promise<void>;
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
        {tasks.length === 0 ? (
          <div className={styles.tableRow}>
            <div className={styles.empty}>タスクが登録されていません</div>
          </div>
        ) : null}

        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            projects={projects}
            task={task}
            updateTaskById={updateTaskById}
          />
        ))}
      </div>
    </div>
  );
}

function TaskRow({
  projects,
  task,
  updateTaskById,
}: {
  projects: Project[];
  task: Task;
  updateTaskById: (taskId: string, data: UpdateTaskData) => Promise<void>;
}) {
  const projectOptions = projects.length > 0 ? projects.map(toSelectOption) : [toSelectOption(task.project)];
  const handleTaskUpdate = (data: UpdateTaskData) => {
    void updateTaskById(task.id, data);
  };

  return (
    <div className={styles.tableRow}>
      <div className={`${styles.tableCell} ${styles.titleCell}`}>
        <EditableField
          defaultValue={task.title}
          label="タスク名"
          onCommit={(title) => {
            const nextTitle = title.trim();

            if (nextTitle && nextTitle !== task.title) {
              handleTaskUpdate({ title: nextTitle });
            }
          }}
        />
      </div>

      <div className={`${styles.tableCell} ${styles.projectCell}`}>
        <TaskSelect
          label={`${task.title} のプロジェクト`}
          options={projectOptions}
          value={task.project.id}
          onSelect={(projectId) => {
            const project = projects.find((item) => item.id === projectId);

            if (!project) {
              return;
            }

            if (project.id !== task.project.id) {
              handleTaskUpdate({ projectId: project.id });
            }
          }}
        />
      </div>

      <div className={`${styles.tableCell} ${styles.statusCell}`}>
        <TaskSelect
          label={`${task.title} のステータス`}
          options={STATUS_OPTIONS}
          value={task.status}
          onSelect={(value) => {
            const status = value as Task["status"];

            if (status !== task.status) {
              handleTaskUpdate({ status });
            }
          }}
        />
      </div>

      <div className={styles.tableCell}>
        <EditableField
          defaultValue={formatDateForDisplay(task.deadline)}
          inputValue={toDateInputValue(task.deadline)}
          label={`${task.title} の期限日`}
          type="date"
          onCommit={(deadline) => {
            if (!deadline || deadline === toDateInputValue(task.deadline)) {
              return;
            }

            handleTaskUpdate({ deadline });
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

function EditableField({
  defaultValue,
  inputValue,
  label,
  onCommit,
  type = "text",
}: {
  defaultValue: string;
  inputValue?: string;
  label: string;
  onCommit: (value: string) => void;
  type?: "date" | "text";
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(inputValue ?? defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const commit = () => {
    setIsEditing(false);
    onCommit(value);
  };

  return (
    <div
      className={styles.editableField}
      onClick={() => {
        if (!isEditing) {
          setValue(inputValue ?? defaultValue);
          setIsEditing(true);
        }
      }}
    >
      {isEditing ? (
        <div className={styles.editableInputContainer}>
          <input
            ref={inputRef}
            aria-label={label}
            className={type === "date" ? styles.dateInput : styles.textInput}
            type={type}
            value={value}
            onBlur={commit}
            onChange={(event) => {
              setValue(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                commit();
              }
            }}
          />
        </div>
      ) : (
        <p className={`${styles.editableText} ${defaultValue ? "" : styles.placeholder}`}>{defaultValue || label}</p>
      )}
    </div>
  );
}

function TaskSelect({
  label,
  onSelect,
  options,
  value,
}: {
  label: string;
  onSelect: (value: string) => void;
  options: readonly SelectOption[];
  value: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`${styles.selector} ${isOpen ? styles.selectorOpen : ""}`}
    >
      <button
        className={styles.selectorButton}
        type="button"
        aria-label={label}
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen((current) => !current);
        }}
      >
        <span className={styles.selectorValue}>{selectedOption?.label}</span>
        <IoCaretDown aria-hidden="true" />
      </button>

      <div className={`${styles.selectPullDownContainer} ${isOpen ? styles.selectPullDownShow : ""}`}>
        <ul className={styles.selectPullDown}>
          {options.map((option) => (
            <li key={option.value}>
              <button
                className={styles.selectOption}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsOpen(false);
                  onSelect(option.value);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Pagination({ limit, page, pageCount }: { limit: number; page: number; pageCount: number }) {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <ul className={styles.pagination}>
      <li>
        <Link
          className={styles.pageButton}
          href={createTasksPageHref(Math.max(1, page - 1), limit)}
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
            href={createTasksPageHref(pageNumber, limit)}
            aria-current={pageNumber === page ? "page" : undefined}
          >
            {pageNumber}
          </Link>
        </li>
      ))}

      <li>
        <Link
          className={styles.pageButton}
          href={createTasksPageHref(Math.min(pageCount, page + 1), limit)}
          aria-label="次のページ"
          aria-disabled={page >= pageCount}
        >
          <IoChevronForward aria-hidden="true" />
        </Link>
      </li>
    </ul>
  );
}

function createTasksPageHref(page: number, limit: number) {
  const params = new URLSearchParams({
    page: String(page),
  });

  if (limit !== INITIAL_PAGE_LIMIT) {
    params.set("limit", String(limit));
  }

  return `/tasks?${params.toString()}`;
}

function formatDateForDisplay(value: string) {
  return toDateInputValue(value).replaceAll("-", "/");
}

function toDateInputValue(value: string) {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
}

function toSelectOption(project: Project): SelectOption {
  return {
    label: project.name,
    value: project.id,
  };
}
