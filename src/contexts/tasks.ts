"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ProjectsClient } from "@/src/requests/projects/client";
import { TasksClient } from "@/src/requests/tasks/client";
import type { PageInfo } from "@/src/requests/schema";
import type { Project } from "@/src/requests/projects/schema";
import type { CreateTaskData, Task, UpdateTaskData } from "@/src/requests/tasks/schema";

export type { CreateTaskData, PageInfo, Project, Task, UpdateTaskData };

type UseTasksListParams = {
  requestedLimit: number;
  requestedPage: number;
};

type UseTaskDetailParams = {
  taskId: string;
};

type TaskDetailState = {
  errorMessage: string | null;
  isTaskLoaded: boolean;
  isUpdating: boolean;
  task: Task | null;
  updateErrorMessage: string | null;
  updateSuccessMessage: string | null;
  updateTask: (data: UpdateTaskData) => Promise<boolean>;
};

const TASK_PROJECTS_LIMIT = 100;
const TASK_LIST_STATUS = "scheduled";
const TASKS_CHANGED_EVENT = "tasks:changed";
const FETCH_TASK_ERROR_MESSAGE = "タスク詳細の取得に失敗しました。時間をおいて再度お試しください。";
const FETCH_TASKS_ERROR_MESSAGE = "タスクの取得に失敗しました。時間をおいて再度お試しください。";
const CREATE_TASK_ERROR_MESSAGE = "タスクの作成に失敗しました。入力内容を確認して再度お試しください。";
const DELETE_TASK_ERROR_MESSAGE = "タスクの削除に失敗しました。時間をおいて再度お試しください。";
const UPDATE_TASK_ERROR_MESSAGE = "タスクの更新に失敗しました。時間をおいて再度お試しください。";
const UPDATE_TASK_SUCCESS_MESSAGE = "タスクを更新しました。";

export function useTasksList({ requestedLimit, requestedPage }: UseTasksListParams) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>(() => createInitialPageInfo(requestedPage, requestedLimit));
  const [limit, setLimit] = useState(requestedLimit);
  const [isTasksLoaded, setIsTasksLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refetchTasks = useCallback(async () => {
    const client = new TasksClient();

    const result = await client.fetchTasks({
      page: requestedPage,
      limit,
      status: TASK_LIST_STATUS,
    });

    const tasks = result.status === "success" ? result.data.data : [];
    const pageInfo = result.status === "success" ? result.data.pageInfo : createInitialPageInfo(requestedPage, limit);
    const errorMessage = result.status === "error" ? FETCH_TASKS_ERROR_MESSAGE : null;

    setTasks(tasks);
    setPageInfo(pageInfo);
    setIsTasksLoaded(true);
    setErrorMessage(errorMessage);
  }, [limit, requestedPage]);

  useEffect(() => {
    const client = new ProjectsClient();

    async function init() {
      const result = await client.fetchProjects({
        page: 1,
        limit: TASK_PROJECTS_LIMIT,
      });

      const projects = result.status === "success" ? result.data.data : [];

      setProjects(projects);
    }

    void init();

    return () => {
      client.abort();
    };
  }, []);

  useEffect(() => {
    const client = new TasksClient();

    async function init() {
      const result = await client.fetchTasks({
        page: requestedPage,
        limit,
        status: TASK_LIST_STATUS,
      });

      const tasks = result.status === "success" ? result.data.data : [];
      const pageInfo = result.status === "success" ? result.data.pageInfo : createInitialPageInfo(requestedPage, limit);
      const errorMessage = result.status === "error" ? FETCH_TASKS_ERROR_MESSAGE : null;

      setTasks(tasks);
      setPageInfo(pageInfo);
      setIsTasksLoaded(true);
      setErrorMessage(errorMessage);
    }

    void init();

    return () => {
      client.abort();
    };
  }, [limit, requestedPage]);

  useEffect(() => {
    window.addEventListener(TASKS_CHANGED_EVENT, refetchTasks);

    return () => {
      window.removeEventListener(TASKS_CHANGED_EVENT, refetchTasks);
    };
  }, [refetchTasks]);

  const pageCount = useMemo(() => {
    return Math.max(1, Math.ceil(pageInfo.totalCount / pageInfo.limit));
  }, [pageInfo.limit, pageInfo.totalCount]);

  const updateTaskById = useCallback(async (taskId: string, data: UpdateTaskData) => {
    const client = new TasksClient();

    const result = await client.updateTask(taskId, data);
    const updatedTask = result.status === "success" ? result.data.data : null;
    const errorMessage = result.status === "error" ? UPDATE_TASK_ERROR_MESSAGE : null;

    if (updatedTask) {
      setTasks((currentTasks) => currentTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
    }

    setErrorMessage(errorMessage);
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

export function useCreateTask() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const createTask = useCallback(async (data: CreateTaskData) => {
    const client = new TasksClient();

    setIsCreating(true);

    const result = await client.createTask(data);
    const errorMessage = result.status === "error" ? CREATE_TASK_ERROR_MESSAGE : null;
    const isSuccess = result.status === "success";

    setErrorMessage(errorMessage);
    setIsCreating(false);

    if (isSuccess) {
      window.dispatchEvent(new Event(TASKS_CHANGED_EVENT));
    }

    return isSuccess;
  }, []);

  return {
    createTask,
    errorMessage,
    isCreating,
  };
}

export function useTaskDetail({ taskId }: UseTaskDetailParams): TaskDetailState {
  const [task, setTask] = useState<Task | null>(null);
  const [isTaskLoaded, setIsTaskLoaded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [updateErrorMessage, setUpdateErrorMessage] = useState<string | null>(null);
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const client = new TasksClient();

    async function init() {
      const result = await client.fetchTask(taskId);

      const task = result.status === "success" ? result.data.data : null;
      const errorMessage = result.status === "error" ? FETCH_TASK_ERROR_MESSAGE : null;

      setTask(task);
      setErrorMessage(errorMessage);
      setUpdateErrorMessage(null);
      setUpdateSuccessMessage(null);
      setIsTaskLoaded(true);
    }

    void init();

    return () => {
      client.abort();
    };
  }, [taskId]);

  const updateTask = useCallback(
    async (data: UpdateTaskData) => {
      const client = new TasksClient();

      setIsUpdating(true);

      const result = await client.updateTask(taskId, data);
      const updatedTask = result.status === "success" ? result.data.data : null;
      const errorMessage = result.status === "error" ? UPDATE_TASK_ERROR_MESSAGE : null;
      const successMessage = result.status === "success" ? UPDATE_TASK_SUCCESS_MESSAGE : null;
      const isSuccess = result.status === "success";

      if (updatedTask) {
        setTask(updatedTask);
        window.dispatchEvent(new Event(TASKS_CHANGED_EVENT));
      }

      setUpdateErrorMessage(errorMessage);
      setUpdateSuccessMessage(successMessage);
      setIsUpdating(false);

      return isSuccess;
    },
    [taskId],
  );

  return {
    errorMessage,
    isTaskLoaded,
    isUpdating,
    task,
    updateErrorMessage,
    updateSuccessMessage,
    updateTask,
  };
}

export function useDeleteTask() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteTask = useCallback(async (taskId: string) => {
    const client = new TasksClient();

    setIsDeleting(true);

    const result = await client.deleteTask(taskId);
    const errorMessage = result.status === "error" ? DELETE_TASK_ERROR_MESSAGE : null;
    const isSuccess = result.status === "success";

    setErrorMessage(errorMessage);
    setIsDeleting(false);

    if (isSuccess) {
      window.dispatchEvent(new Event(TASKS_CHANGED_EVENT));
    }

    return isSuccess;
  }, []);

  return {
    deleteTask,
    errorMessage,
    isDeleting,
  };
}

function createInitialPageInfo(page: number, limit: number): PageInfo {
  return {
    totalCount: 0,
    page,
    limit,
  };
}
