"use client";

import { ListPageControls } from "@/src/components/molecules/ListPageControls";
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
      <ListPageControls
        id="task-limit"
        limit={limit}
        onLimitChange={onLimitChange}
        page={page}
        pageCount={pageCount}
        totalCount={totalCount}
      />
    </div>
  );
}
