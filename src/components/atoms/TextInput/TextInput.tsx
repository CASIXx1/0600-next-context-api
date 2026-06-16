import { forwardRef, type ComponentPropsWithoutRef } from "react";
import styles from "./TextInput.module.css";

type TextInputProps = ComponentPropsWithoutRef<"input">;

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
