"use client";

import { useRouter } from "next/navigation";
import { FormMessage } from "@/src/components/atoms/FormMessage";
import { useTasksList } from "@/src/contexts/tasks";
import { ListPageControls } from "@/src/components/molecules/ListPageControls";
import { Pagination } from "@/src/components/molecules/Pagination";
import { TaskTable } from "@/src/components/tasks/TaskTable";
import styles from "./content.module.css";

type TasksContentProps = {
  requestedLimit: number;
  requestedPage: number;
};

const INITIAL_PAGE_LIMIT = 20;

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
              <FormMessage
                className={styles.errorMessage}
                tone="error"
              >
                {errorMessage}
              </FormMessage>
            ) : null}

            <div className={styles.listHeader}>
              <ListPageControls
                id="task-limit"
                limit={limit}
                page={pageInfo.page}
                pageCount={pageCount}
                totalCount={pageInfo.totalCount}
                onLimitChange={(nextLimit) => {
                  setLimit(nextLimit);
                  router.replace(createTasksPageHref(1, nextLimit));
                }}
              />
            </div>

            <TaskTable
              projects={projects}
              tasks={tasks}
              updateTaskById={updateTaskById}
            />

            <footer className={styles.footer}>
              <Pagination
                getPageHref={(targetPage) => createTasksPageHref(targetPage, limit)}
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

function createTasksPageHref(page: number, limit: number) {
  const params = new URLSearchParams({
    page: String(page),
  });

  if (limit !== INITIAL_PAGE_LIMIT) {
    params.set("limit", String(limit));
  }

  return `/tasks?${params.toString()}`;
}
