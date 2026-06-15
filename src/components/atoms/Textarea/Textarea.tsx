import type { ChangeEventHandler } from "react";
import styles from "./Textarea.module.css";

type TextareaProps = {
  id: string;
  name: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  rows?: number;
  value: string;
};

export function Textarea({ id, name, onChange, placeholder, rows, value }: TextareaProps) {
  return (
    <textarea
      className={styles.textarea}
      id={id}
      name={name}
      value={value}
      placeholder={placeholder}
      rows={rows}
      onChange={onChange}
    />
  );
}
