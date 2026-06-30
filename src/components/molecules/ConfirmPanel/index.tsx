import type { ReactNode } from "react";
import { Button } from "@/src/components/atoms/Button";
import styles from "./index.module.css";

type ConfirmPanelProps = {
  cancelLabel: string;
  confirmLabel: string;
  description: ReactNode;
  descriptionId: string;
  disabled?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  titleId: string;
};

export function ConfirmPanel({
  cancelLabel,
  confirmLabel,
  description,
  descriptionId,
  disabled = false,
  onCancel,
  onConfirm,
  title,
  titleId,
}: ConfirmPanelProps) {
  return (
    <div
      className={styles.panel}
      role="group"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div>
        <h2
          className={styles.title}
          id={titleId}
        >
          {title}
        </h2>
        <p
          className={styles.description}
          id={descriptionId}
        >
          {description}
        </p>
      </div>
      <div className={styles.actions}>
        <Button
          className={styles.button}
          type="button"
          variant="danger"
          size="small"
          disabled={disabled}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
        <Button
          className={styles.button}
          type="button"
          variant="secondary"
          size="small"
          disabled={disabled}
          onClick={onCancel}
        >
          {cancelLabel}
        </Button>
      </div>
    </div>
  );
}
