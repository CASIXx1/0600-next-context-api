import type { ChangeEventHandler } from "react";
import styles from "./TextInput.module.css";

type TextInputProps = {
  id: string;
  name: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "date";
  value: string;
};

export function TextInput({ id, name, onChange, placeholder, required = false, type = "text", value }: TextInputProps) {
  return (
    <input
      className={styles.input}
      id={id}
      name={name}
      type={type}
      value={value}
      placeholder={placeholder}
      required={required}
      onChange={onChange}
    />
  );
}
