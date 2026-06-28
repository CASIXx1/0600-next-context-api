import type { ReactNode } from "react";
import styles from "./index.module.css";

type LabeledFieldLayout = "vertical" | "horizontal";

type LabeledFieldProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  htmlFor?: string;
  label: ReactNode;
  labelClassName?: string;
  layout?: LabeledFieldLayout;
  labelSize?: "small" | "medium";
  required?: boolean;
};

const fieldClassNames: Record<LabeledFieldLayout, string> = {
  vertical: styles.verticalField,
  horizontal: styles.horizontalField,
};

const labelClassNames: Record<LabeledFieldLayout, string> = {
  vertical: styles.verticalLabel,
  horizontal: styles.horizontalLabel,
};

const labelSizeClassNames = {
  small: styles.smallLabel,
  medium: styles.mediumLabel,
};

const labelTextClassNames: Record<LabeledFieldLayout, string | undefined> = {
  vertical: undefined,
  horizontal: styles.horizontalLabelText,
};

function classNames(...names: Array<string | false | undefined>) {
  return names.filter(Boolean).join(" ");
}

export function LabeledField({
  children,
  className,
  contentClassName,
  htmlFor,
  label,
  labelClassName,
  layout = "vertical",
  labelSize = "medium",
  required = false,
}: LabeledFieldProps) {
  const fieldClassName = classNames(fieldClassNames[layout], className);
  const fieldLabelClassName = classNames(
    labelClassNames[layout],
    labelSizeClassNames[labelSize],
    required && styles.required,
    labelClassName,
  );
  const labelTextClassName = labelTextClassNames[layout];
  const labelContent = labelTextClassName ? <span className={labelTextClassName}>{label}</span> : label;
  const content = contentClassName ? <div className={contentClassName}>{children}</div> : children;

  return (
    <div className={fieldClassName}>
      {htmlFor ? (
        <label
          className={fieldLabelClassName}
          htmlFor={htmlFor}
        >
          {labelContent}
        </label>
      ) : (
        <div className={fieldLabelClassName}>{labelContent}</div>
      )}
      {content}
    </div>
  );
}
