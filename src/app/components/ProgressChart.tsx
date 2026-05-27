"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import type { ChartConfiguration } from "chart.js";
import type { Stats } from "@/src/contexts/dashboard";
import styles from "./ProgressChart.module.css";

type ProgressChartProps = {
  stats: Stats[];
};

const CHART_COLORS = {
  completed: {
    backgroundColor: "#8fe3c7",
    borderColor: "#8fe3c7",
  },
  todo: {
    backgroundColor: "#8fe3c740",
    borderColor: "#8fe3c7",
  },
} as const;

export function ProgressChart({ stats }: ProgressChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || stats.length === 0) {
      return;
    }

    const chart = new Chart(canvas, createChartConfig(stats));

    return () => {
      chart.destroy();
    };
  }, [stats]);

  if (stats.length === 0) {
    return <p className={styles.empty}>データがありません</p>;
  }

  return (
    <div className={styles.container}>
      <canvas
        ref={canvasRef}
        aria-label="進捗"
        role="img"
      />
    </div>
  );
}

function createChartConfig(stats: Stats[]): ChartConfiguration<"bar", number[], string> {
  return {
    type: "bar",
    data: {
      labels: stats[0]?.data.map((item) => formatLabel(item.date)) ?? [],
      datasets: stats.map((item) => ({
        label: item.label,
        data: item.data.map((dataPoint) => dataPoint.value),
        borderWidth: 1,
        stack: "progress",
        ...CHART_COLORS[item.type],
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          align: "end",
          labels: {
            boxHeight: 10,
            boxWidth: 10,
            color: "#787c7d",
            font: {
              size: 11,
              weight: 500,
            },
          },
          position: "top",
        },
      },
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false,
          },
          ticks: {
            color: "#787c7d",
            font: {
              size: 10,
              weight: 500,
            },
          },
        },
        y: {
          beginAtZero: true,
          stacked: true,
          border: {
            display: false,
          },
          ticks: {
            color: "#787c7d",
            font: {
              size: 10,
              weight: 500,
            },
          },
        },
      },
    },
  };
}

function formatLabel(date: number) {
  return new Intl.DateTimeFormat("ja-JP", {
    month: "numeric",
    day: "numeric",
  }).format(date);
}
