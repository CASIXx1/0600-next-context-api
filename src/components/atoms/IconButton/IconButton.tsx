import type { MouseEventHandler, ReactNode } from "react";
import styles from "./IconButton.module.css";

type IconButtonProps = {
  ariaExpanded?: boolean;
  ariaLabel: string;
  children: ReactNode;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
};

export function IconButton({
  ariaExpanded,
  ariaLabel,
  children,
  disabled = false,
  onClick,
  type = "button",
}: IconButtonProps) {
  return (
    <button
      className={styles.button}
      type={type}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
