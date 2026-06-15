import type { ChangeEventHandler, ReactNode } from "react";
import { IoCaretDown } from "react-icons/io5";
import styles from "./Select.module.css";

type SelectProps = {
  children: ReactNode;
  id: string;
  name: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  required?: boolean;
  value: string;
};

export function Select({ children, id, name, onChange, required = false, value }: SelectProps) {
  return (
    <div className={styles.container}>
      <select
        className={styles.select}
        id={id}
        name={name}
        value={value}
        required={required}
        onChange={onChange}
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
