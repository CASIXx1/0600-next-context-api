import type { ComponentPropsWithoutRef } from "react";
import styles from "./IconButton.module.css";

type IconButtonProps = ComponentPropsWithoutRef<"button"> & {
  ariaExpanded?: boolean;
  ariaLabel: string;
};

export function IconButton({
  ariaExpanded,
  "aria-expanded": ariaExpandedAttribute,
  ariaLabel,
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  const buttonClassName = [styles.button, className].filter(Boolean).join(" ");

  return (
    <button
      className={buttonClassName}
      type={type}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded ?? ariaExpandedAttribute}
      {...props}
    />
  );
}
