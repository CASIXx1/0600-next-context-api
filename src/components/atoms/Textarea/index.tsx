import type { ComponentPropsWithoutRef } from "react";
import styles from "./Textarea.module.css";

type TextareaProps = ComponentPropsWithoutRef<"textarea">;

export function Textarea({ className, ...props }: TextareaProps) {
  const textareaClassName = [styles.textarea, className].filter(Boolean).join(" ");

  return (
    <textarea
      className={textareaClassName}
      {...props}
    />
  );
}
