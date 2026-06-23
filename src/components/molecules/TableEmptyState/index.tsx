import type { ReactNode } from "react";
import styles from "./TableEmptyState.module.css";

type TableEmptyStateProps = {
  className?: string;
  message: ReactNode;
};

export function TableEmptyState({ className, message }: TableEmptyStateProps) {
  return (
    <div className={[styles.row, className].filter(Boolean).join(" ")}>
      <div className={styles.message}>{message}</div>
    </div>
  );
}
