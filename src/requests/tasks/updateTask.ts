import type { UpdateTaskData, UpdateTaskResponse } from "./schema";

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

  return response.json() as Promise<UpdateTaskResponse>;
}
