"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { runAbortableEffect, runAbortableRequest } from "./abort";
import { fetchProjects } from "@/src/requests/projects/client";
import { fetchTasks, updateTask } from "@/src/requests/tasks/client";
import type { PageInfo } from "@/src/requests/schema";
import type { Project } from "@/src/requests/projects/schema";
import type { Task, UpdateTaskData } from "@/src/requests/tasks/schema";

export type { PageInfo, Project, Task, UpdateTaskData };

type UseTasksListParams = {
  requestedLimit: number;
  requestedPage: number;
};

const TASK_PROJECTS_LIMIT = 100;
const TASK_LIST_STATUS = "scheduled";
const UPDATE_TASK_ERROR_MESSAGE = "タスクの更新に失敗しました。時間をおいて再度お試しください。";

export function useTasksList({ requestedLimit, requestedPage }: UseTasksListParams) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>(() => createInitialPageInfo(requestedPage, requestedLimit));
  const [limit, setLimit] = useState(requestedLimit);
  const [isTasksLoaded, setIsTasksLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    return runAbortableEffect((signal) => {
      async function init() {
        let nextProjects: Project[] = [];

        const result = await runAbortableRequest(signal, (requestSignal) =>
          fetchProjects(
            {
              page: 1,
              limit: TASK_PROJECTS_LIMIT,
            },
            {
              signal: requestSignal,
            },
          ),
        );

        if (result.status === "aborted") {
          return;
        }

        if (result.status === "success") {
          nextProjects = result.data.data;
        } else {
          nextProjects = [];
        }

        setProjects(nextProjects);
      }

      void init();
    });
  }, []);

  useEffect(() => {
    return runAbortableEffect((signal) => {
      async function init() {
        let nextTasks: Task[] = [];
        let nextPageInfo = createInitialPageInfo(requestedPage, limit);
        const nextErrorMessage: string | null = null;
        let shouldUpdateErrorMessage = true;

        const result = await runAbortableRequest(signal, (requestSignal) =>
          fetchTasks(
            {
              page: requestedPage,
              limit,
              status: TASK_LIST_STATUS,
            },
            {
              signal: requestSignal,
            },
          ),
        );

        if (result.status === "aborted") {
          return;
        }

        if (result.status === "success") {
          nextTasks = result.data.data;
          nextPageInfo = result.data.pageInfo;
        } else {
          shouldUpdateErrorMessage = false;
        }

        setTasks(nextTasks);
        setPageInfo(nextPageInfo);
        setIsTasksLoaded(true);

        if (shouldUpdateErrorMessage) {
          setErrorMessage(nextErrorMessage);
        }
      }

      void init();
    });
  }, [limit, requestedPage]);

  const pageCount = useMemo(() => {
    return Math.max(1, Math.ceil(pageInfo.totalCount / pageInfo.limit));
  }, [pageInfo.limit, pageInfo.totalCount]);

  const updateTaskById = useCallback(async (taskId: string, data: UpdateTaskData) => {
    let updatedTask: Task | null = null;
    let nextErrorMessage: string | null = null;

    try {
      const response = await updateTask(taskId, data);

      updatedTask = response.data;
    } catch {
      nextErrorMessage = UPDATE_TASK_ERROR_MESSAGE;
    }

    if (updatedTask) {
      setTasks((currentTasks) => currentTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
    }

    setErrorMessage(nextErrorMessage);
  }, []);

  return {
    errorMessage,
    isTasksLoaded,
    limit,
    pageCount,
    pageInfo,
    projects,
    setLimit,
    tasks,
    updateTaskById,
  };
}

function createInitialPageInfo(page: number, limit: number): PageInfo {
  return {
    totalCount: 0,
    page,
    limit,
  };
}
