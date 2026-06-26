import { forwardRef, type InputHTMLAttributes } from "react";
import styles from "./index.module.css";

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { className, type = "text", ...props },
  ref,
) {
  const inputClassName = [styles.input, className].filter(Boolean).join(" ");

  return (
    <input
      ref={ref}
      className={inputClassName}
      type={type}
      {...props}
    />
  );
});
