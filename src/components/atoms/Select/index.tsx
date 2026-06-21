import type { ComponentPropsWithoutRef } from "react";
import { IoCaretDown } from "react-icons/io5";
import styles from "./Select.module.css";

export type SelectOption = {
  disabled?: boolean;
  label: string;
  value: string;
};

type SelectProps = Omit<ComponentPropsWithoutRef<"select">, "children"> & {
  containerClassName?: string;
  options: readonly SelectOption[];
  placeholder?: string;
};

export function Select({ className, containerClassName, options, placeholder, ...props }: SelectProps) {
  const wrapperClassName = [styles.container, containerClassName].filter(Boolean).join(" ");
  const selectClassName = [styles.select, className].filter(Boolean).join(" ");

  return (
    <div className={wrapperClassName}>
      <select
        className={selectClassName}
        {...props}
      >
        {placeholder ? (
          <option
            value=""
            disabled
          >
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      <IoCaretDown
        className={styles.icon}
        aria-hidden="true"
      />
    </div>
  );
}
