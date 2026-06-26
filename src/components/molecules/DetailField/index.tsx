import type { ReactNode } from "react";
import styles from "./index.module.css";

type DetailFieldProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  label: ReactNode;
  labelClassName?: string;
  labelHtmlFor?: string;
};

export function DetailField({
  children,
  className,
  contentClassName,
  label,
  labelClassName,
  labelHtmlFor,
}: DetailFieldProps) {
  const fieldClassName = [styles.field, className].filter(Boolean).join(" ");
  const fieldLabelClassName = [styles.label, labelClassName].filter(Boolean).join(" ");
  const labelContent = <span className={styles.labelText}>{label}</span>;

  return (
    <div className={fieldClassName}>
      {labelHtmlFor ? (
        <label
          className={fieldLabelClassName}
          htmlFor={labelHtmlFor}
        >
          {labelContent}
        </label>
      ) : (
        <div className={fieldLabelClassName}>{labelContent}</div>
      )}
      {contentClassName ? <div className={contentClassName}>{children}</div> : children}
    </div>
  );
}
