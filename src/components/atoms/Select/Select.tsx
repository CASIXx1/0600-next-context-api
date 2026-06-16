import type { ComponentPropsWithoutRef } from "react";
import { IoCaretDown } from "react-icons/io5";
import styles from "./Select.module.css";

type SelectProps = ComponentPropsWithoutRef<"select"> & {
  containerClassName?: string;
};

export function Select({ children, className, containerClassName, ...props }: SelectProps) {
  const wrapperClassName = [styles.container, containerClassName].filter(Boolean).join(" ");
  const selectClassName = [styles.select, className].filter(Boolean).join(" ");

  return (
    <div className={wrapperClassName}>
      <select
        className={selectClassName}
        {...props}
      >
        {children}
      </select>
      <IoCaretDown
        className={styles.icon}
        aria-hidden="true"
      />
    </div>
  );
}
