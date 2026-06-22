"use client";

import { Select } from "@/src/components/atoms/Select";
import styles from "./TaskListHeader.module.css";

type TaskListHeaderProps = {
  limit: number;
  onLimitChange: (limit: number) => void;
  page: number;
  pageCount: number;
  totalCount: number;
};

const LIMIT_OPTIONS = [
  {
    label: "20 件",
    value: "20",
  },
  {
    label: "50 件",
    value: "50",
  },
  {
    label: "100 件",
    value: "100",
  },
] as const;

export function TaskListHeader({ limit, onLimitChange, page, pageCount, totalCount }: TaskListHeaderProps) {
  return (
    <div className={styles.listHeader}>
      <div className={styles.number}>
        <div className={styles.pageIndex}>
          <span>
            {page} / {pageCount}
          </span>
        </div>

        <div className={styles.displayPageCount}>
          <label htmlFor="task-limit">表示件数 : </label>
          <Select
            id="task-limit"
            containerClassName={styles.selectContainer}
            className={styles.select}
            value={String(limit)}
            options={LIMIT_OPTIONS}
            onChange={(event) => {
              onLimitChange(Number(event.target.value));
            }}
          />
        </div>

        <div>
          <span className={styles.total}>{totalCount} 件</span>
        </div>
      </div>
    </div>
  );
}
