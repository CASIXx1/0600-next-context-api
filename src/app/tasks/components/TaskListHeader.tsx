"use client";

import styles from "./TaskListHeader.module.css";

type TaskListHeaderProps = {
  limit: number;
  onLimitChange: (limit: number) => void;
  page: number;
  pageCount: number;
  totalCount: number;
};

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
          <select
            id="task-limit"
            className={styles.select}
            value={limit}
            onChange={(event) => {
              onLimitChange(Number(event.target.value));
            }}
          >
            <option value="20">20 件</option>
            <option value="50">50 件</option>
            <option value="100">100 件</option>
          </select>
        </div>

        <div>
          <span className={styles.total}>{totalCount} 件</span>
        </div>
      </div>
    </div>
  );
}
