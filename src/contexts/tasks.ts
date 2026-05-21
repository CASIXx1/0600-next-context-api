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
    let isActive = true;

    fetchProjects({
      page: 1,
      limit: TASK_PROJECTS_LIMIT,
    })
      .then(({ data }) => {
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

    fetchTasks({
      page: requestedPage,
      limit,
      status: TASK_LIST_STATUS,
    })
      .then(({ data, pageInfo: responsePageInfo }) => {
        if (!isActive) {
          return;
        }

        setTasks(data);
        setPageInfo(responsePageInfo);
        setIsTasksLoaded(true);
        setErrorMessage(null);
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        setTasks([]);
        setPageInfo(createInitialPageInfo(requestedPage, limit));
        setIsTasksLoaded(true);
      });

    return () => {
      isActive = false;
    };
  }, [limit, requestedPage]);

  const pageCount = useMemo(() => {
    return Math.max(1, Math.ceil(pageInfo.totalCount / pageInfo.limit));
  }, [pageInfo.limit, pageInfo.totalCount]);

  const updateTaskById = useCallback((taskId: string, data: UpdateTaskData) => {
    return updateTask(taskId, data)
      .then(({ data: updatedTask }) => {
        setTasks((currentTasks) => currentTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
        setErrorMessage(null);
      })
      .catch(() => {
        setErrorMessage(UPDATE_TASK_ERROR_MESSAGE);
      });
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
