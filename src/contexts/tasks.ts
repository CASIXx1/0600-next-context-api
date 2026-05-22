"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchProjects } from "@/src/requests/projects/fetchProjects";
import { fetchTasks } from "@/src/requests/tasks/fetchTasks";
import { updateTask } from "@/src/requests/tasks/updateTask";
import type { Project } from "@/src/requests/projects/schema";
import type { Task, TasksPageInfo, UpdateTaskData } from "@/src/requests/tasks/schema";

export type { Project, Task, TasksPageInfo, UpdateTaskData };

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
  const [pageInfo, setPageInfo] = useState<TasksPageInfo>(() => createInitialPageInfo(requestedPage, requestedLimit));
  const [limit, setLimit] = useState(requestedLimit);
  const [isTasksLoaded, setIsTasksLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function init() {
      let nextProjects: Project[] = [];

      try {
        const { data } = await fetchProjects(
          {
            page: 1,
            limit: TASK_PROJECTS_LIMIT,
          },
          {
            signal: controller.signal,
          },
        );

        nextProjects = data;
      } catch (error) {
        if (isAbortError(error)) {
          return;
        }

        nextProjects = [];
      }

      setProjects(nextProjects);
    }

    void init();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function init() {
      let nextTasks: Task[] = [];
      let nextPageInfo = createInitialPageInfo(requestedPage, limit);
      const nextErrorMessage: string | null = null;
      let shouldUpdateErrorMessage = true;

      try {
        const { data, pageInfo: responsePageInfo } = await fetchTasks(
          {
            page: requestedPage,
            limit,
            status: TASK_LIST_STATUS,
          },
          {
            signal: controller.signal,
          },
        );

        nextTasks = data;
        nextPageInfo = responsePageInfo;
      } catch (error) {
        if (isAbortError(error)) {
          return;
        }

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

    return () => {
      controller.abort();
    };
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

function createInitialPageInfo(page: number, limit: number): TasksPageInfo {
  return {
    totalCount: 0,
    page,
    limit,
  };
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}
