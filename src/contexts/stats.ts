"use client";

import { useEffect, useState } from "react";
import { runAbortableEffect, runAbortableRequest } from "./abort";
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
    return runAbortableEffect((signal) => {
      async function init() {
        let nextStats: Stats[] = [];
        let nextErrorMessage: string | null = null;

        const result = await runAbortableRequest(signal, (requestSignal) =>
          fetchStats({
            signal: requestSignal,
          }),
        );

        if (result.status === "aborted") {
          return;
        }

        if (result.status === "success") {
          nextStats = result.data.data;
        } else {
          console.error(result.error);

          nextErrorMessage = FETCH_STATS_ERROR_MESSAGE;
        }

        setStats(nextStats);
        setErrorMessage(nextErrorMessage);
      }

      void init();
    });
  }, []);

  return {
    errorMessage,
    stats,
  };
}
