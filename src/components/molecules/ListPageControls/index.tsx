"use client";

import { Select } from "@/src/components/atoms/Select";
import styles from "./index.module.css";

const DEFAULT_LIMIT_OPTIONS = [20, 50, 100] as const;

type ListPageControlsProps = {
  id: string;
  limit: number;
  limitOptions?: readonly number[];
  onLimitChange: (limit: number) => void;
  page: number;
  pageCount: number;
  totalCount: number;
};

export function ListPageControls({
  id,
  limit,
  limitOptions = DEFAULT_LIMIT_OPTIONS,
  onLimitChange,
  page,
  pageCount,
  totalCount,
}: ListPageControlsProps) {
  const selectOptions = limitOptions.map((option) => ({
    label: `${option} 件`,
    value: String(option),
  }));

  return (
    <div className={styles.number}>
      <div className={styles.pageIndex}>
        <span>
          {page} / {pageCount}
        </span>
      </div>

      <div className={styles.displayPageCount}>
        <label htmlFor={id}>表示件数 : </label>
        <Select
          id={id}
          containerClassName={styles.selectContainer}
          className={styles.select}
          value={String(limit)}
          options={selectOptions}
          onChange={(event) => {
            onLimitChange(Number(event.target.value));
          }}
        />
      </div>

      <div>
        <span className={styles.total}>{totalCount} 件</span>
      </div>
    </div>
  );
}
