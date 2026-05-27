import type { StatsResponse } from "./schema";

export async function fetchStats(options?: RequestInit) {
  const response = await fetch("/api/v1/users/stats", {
    cache: "no-store",
    ...options,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }

  return response.json() as Promise<StatsResponse>;
}
