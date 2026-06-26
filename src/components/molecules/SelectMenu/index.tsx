"use client";

import { useEffect, useRef, useState } from "react";
import { IoCaretDown } from "react-icons/io5";
import styles from "./index.module.css";

export type SelectOption = {
  label: string;
  value: string;
};

type SelectMenuProps = {
  label: string;
  onOpenChange?: (isOpen: boolean) => void;
  onSelect: (value: string) => void;
  options: readonly SelectOption[];
  value: string;
};

export function SelectMenu({ label, onOpenChange, onSelect, options, value }: SelectMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value) ?? options[0];
  const handleSelect = (value: string) => {
    setIsOpen(false);
    onOpenChange?.(false);
    onSelect(value);
  };

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (isOpen && !containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        onOpenChange?.(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [isOpen, onOpenChange]);

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
          const nextIsOpen = !isOpen;

          setIsOpen(nextIsOpen);
          onOpenChange?.(nextIsOpen);
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
                onPointerDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleSelect(option.value);
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  handleSelect(option.value);
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
