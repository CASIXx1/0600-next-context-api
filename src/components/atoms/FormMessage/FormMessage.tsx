import type { ReactNode } from "react";
import styles from "./FormMessage.module.css";

type FormMessageTone = "error" | "success";

type FormMessageProps = {
  children: ReactNode;
  tone: FormMessageTone;
};

export function FormMessage({ children, tone }: FormMessageProps) {
  const className = [styles.message, styles[tone]].join(" ");
  const role = tone === "error" ? "alert" : "status";

  return (
    <p
      className={className}
      role={role}
    >
      {children}
    </p>
  );
}
