import type { Task, TaskStatus } from "./fetchTasks";

type UpdateTaskData = Partial<Pick<Task, "deadline" | "title">> & {
  projectId?: string;
  status?: TaskStatus;
};

export async function updateTask(taskId: string, data: UpdateTaskData) {
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
