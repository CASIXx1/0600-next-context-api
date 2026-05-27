"use client";

import { useEffect, useState } from "react";
import { fetchStats } from "@/src/requests/stats/client";
import type { Stats } from "@/src/requests/stats/schema";

export type { Stats };

type StatsState = {
  errorMessage: string | null;
  stats: Stats[];
};

const FETCH_STATS_ERROR_MESSAGE = "進捗の取得に失敗しました。時間をおいて再度お試しください。";

export function useStats(): StatsState {
  const [stats, setStats] = useState<Stats[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function init() {
      let nextStats: Stats[] = [];
      let nextErrorMessage: string | null = null;

      try {
        const { data } = await fetchStats({
          signal: controller.signal,
        });

        nextStats = data;
      } catch (error) {
        if (isAbortError(error)) {
          return;
        }

        console.error(error);

        nextErrorMessage = FETCH_STATS_ERROR_MESSAGE;
      }

      setStats(nextStats);
      setErrorMessage(nextErrorMessage);
    }

    void init();

    return () => {
      controller.abort();
    };
  }, []);

  return {
    errorMessage,
    stats,
  };
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}
