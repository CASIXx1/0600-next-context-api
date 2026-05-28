"use client";

import { useEffect, useState } from "react";
import { StatsClient } from "@/src/requests/stats/client";
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
    const client = new StatsClient();
    async function init() {
      try {
        const res = await client.fetchStats();
        if (!res) {
          setStats([]);
          return;
        }

        setStats(res.data);
        setErrorMessage(null);
      } catch {
        setStats([]);
        setErrorMessage(FETCH_STATS_ERROR_MESSAGE);
      }
    }

    void init();

    return () => {
      client.abort();
    };
  }, []);

  return {
    errorMessage,
    stats,
  };
}
