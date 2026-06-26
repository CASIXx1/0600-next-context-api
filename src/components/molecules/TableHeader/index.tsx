import type { ReactNode } from "react";
import styles from "./index.module.css";

export type TableHeaderColumn = {
  label?: ReactNode;
  className?: string;
};

type TableHeaderProps = {
  className?: string;
  columns: readonly TableHeaderColumn[];
};

export function TableHeader({ className, columns }: TableHeaderProps) {
  return (
    <div
      className={[styles.header, className].filter(Boolean).join(" ")}
      role="row"
    >
      {columns.map((column, index) => (
        <div
          key={index}
          className={[styles.cell, column.className].filter(Boolean).join(" ")}
          role="columnheader"
        >
          {column.label ?? null}
        </div>
      ))}
    </div>
  );
}
