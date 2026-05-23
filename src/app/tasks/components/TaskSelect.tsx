"use client";

import { useEffect, useRef, useState } from "react";
import { IoCaretDown } from "react-icons/io5";
import styles from "./TaskSelect.module.css";

export type SelectOption = {
  label: string;
  value: string;
};

type TaskSelectProps = {
  label: string;
  onOpenChange?: (isOpen: boolean) => void;
  onSelect: (value: string) => void;
  options: readonly SelectOption[];
  value: string;
};

export function TaskSelect({ label, onOpenChange, onSelect, options, value }: TaskSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        onOpenChange?.(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [onOpenChange]);

  return (
    <div
      ref={containerRef}
      className={`${styles.selector} ${isOpen ? styles.selectorOpen : ""}`}
    >
      <button
        className={styles.selectorButton}
        type="button"
        aria-label={label}
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen((current) => {
            const nextIsOpen = !current;

            onOpenChange?.(nextIsOpen);

            return nextIsOpen;
          });
        }}
      >
        <span className={styles.selectorValue}>{selectedOption?.label}</span>
        <IoCaretDown aria-hidden="true" />
      </button>

      <div className={`${styles.selectPullDownContainer} ${isOpen ? styles.selectPullDownShow : ""}`}>
        <ul className={styles.selectPullDown}>
          {options.map((option) => (
            <li key={option.value}>
              <button
                className={styles.selectOption}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsOpen(false);
                  onOpenChange?.(false);
                  onSelect(option.value);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
