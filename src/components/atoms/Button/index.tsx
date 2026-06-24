import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "medium" | "small";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export function Button({ className, size = "medium", type = "button", variant = "primary", ...props }: ButtonProps) {
  const buttonClassName = [styles.button, styles[variant], styles[size], className].filter(Boolean).join(" ");

  return (
    <button
      className={buttonClassName}
      type={type}
      {...props}
    />
  );
}
