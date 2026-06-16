"use client";

import { useEffect, useRef, useState } from "react";
import { TextInput } from "@/src/components/atoms/TextInput";
import styles from "./EditableField.module.css";

type EditableFieldProps = {
  defaultValue: string;
  inputValue?: string;
  label: string;
  onCommit: (value: string) => void;
  type?: "date" | "text";
};

export function EditableField({ defaultValue, inputValue, label, onCommit, type = "text" }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(inputValue ?? defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const commit = () => {
    setIsEditing(false);
    onCommit(value);
  };

  return (
    <div
      className={styles.editableField}
      onClick={() => {
        if (!isEditing) {
          setValue(inputValue ?? defaultValue);
          setIsEditing(true);
        }
      }}
    >
      {isEditing ? (
        <div className={styles.editableInputContainer}>
          <TextInput
            ref={inputRef}
            aria-label={label}
            className={type === "date" ? styles.dateInput : styles.textInput}
            type={type}
            value={value}
            onBlur={commit}
            onChange={(event) => {
              setValue(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                commit();
              }
            }}
          />
        </div>
      ) : (
        <p className={`${styles.editableText} ${defaultValue ? "" : styles.placeholder}`}>{defaultValue || label}</p>
      )}
    </div>
  );
}
