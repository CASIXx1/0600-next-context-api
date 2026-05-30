"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ProjectsClient } from "@/src/requests/projects/client";
import { TasksClient } from "@/src/requests/tasks/client";
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
    const client = new ProjectsClient();

    async function init() {
      let nextProjects: Project[] = [];

      const result = await client.fetchProjects({
        page: 1,
        limit: TASK_PROJECTS_LIMIT,
      });

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

    return () => {
      client.abort();
    };
  }, []);

  useEffect(() => {
    const client = new TasksClient();

    async function init() {
      let nextTasks: Task[] = [];
      let nextPageInfo = createInitialPageInfo(requestedPage, limit);
      const nextErrorMessage: string | null = null;
      let shouldUpdateErrorMessage = true;

      const result = await client.fetchTasks({
        page: requestedPage,
        limit,
        status: TASK_LIST_STATUS,
      });

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

    return () => {
      client.abort();
    };
  }, [limit, requestedPage]);

  const pageCount = useMemo(() => {
    return Math.max(1, Math.ceil(pageInfo.totalCount / pageInfo.limit));
  }, [pageInfo.limit, pageInfo.totalCount]);

  const updateTaskById = useCallback(async (taskId: string, data: UpdateTaskData) => {
    const client = new TasksClient();
    let updatedTask: Task | null = null;
    let nextErrorMessage: string | null = null;

    try {
      const response = await client.updateTask(taskId, data);

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
