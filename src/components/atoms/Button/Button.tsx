import type { MouseEventHandler, ReactNode } from "react";
import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
};

export function Button({ children, disabled = false, onClick, type = "button", variant = "primary" }: ButtonProps) {
  const className = [styles.button, styles[variant]].join(" ");

  return (
    <button
      className={className}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
