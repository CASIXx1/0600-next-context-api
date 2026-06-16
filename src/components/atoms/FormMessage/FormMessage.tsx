import type { ComponentPropsWithoutRef } from "react";
import styles from "./FormMessage.module.css";

type FormMessageTone = "error" | "success";

type FormMessageProps = ComponentPropsWithoutRef<"p"> & {
  tone: FormMessageTone;
};

export function FormMessage({ className, role, tone, ...props }: FormMessageProps) {
  const messageClassName = [styles.message, styles[tone], className].filter(Boolean).join(" ");
  const messageRole = role ?? (tone === "error" ? "alert" : "status");

  return (
    <p
      className={messageClassName}
      role={messageRole}
      {...props}
    />
  );
}
