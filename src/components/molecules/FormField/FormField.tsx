import type { ReactNode } from "react";
import styles from "./FormField.module.css";

type FormFieldProps = {
  children: ReactNode;
  htmlFor: string;
  label: string;
  labelSize?: "medium" | "small";
  required?: boolean;
};

export function FormField({ children, htmlFor, label, labelSize = "medium", required = false }: FormFieldProps) {
  const labelClassName = [
    styles.label,
    labelSize === "small" ? styles.smallLabel : styles.mediumLabel,
    required ? styles.required : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.field}>
      <label
        className={labelClassName}
        htmlFor={htmlFor}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
