import type { ReactNode } from "react";
import styles from "./DetailField.module.css";

type DetailFieldProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  label: ReactNode;
  labelClassName?: string;
};

export function DetailField({ children, className, contentClassName, label, labelClassName }: DetailFieldProps) {
  const fieldClassName = [styles.field, className].filter(Boolean).join(" ");
  const fieldLabelClassName = [styles.label, labelClassName].filter(Boolean).join(" ");

  return (
    <div className={fieldClassName}>
      <div className={fieldLabelClassName}>
        <span className={styles.labelText}>{label}</span>
      </div>
      {contentClassName ? <div className={contentClassName}>{children}</div> : children}
    </div>
  );
}
