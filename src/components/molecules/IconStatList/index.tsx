import type { CSSProperties, ReactNode } from "react";
import styles from "./index.module.css";

type IconStatListVariant = "card" | "detail";

export type IconStatItem = {
  icon: ReactNode;
  value: ReactNode;
  ariaLabel?: string;
};

type IconStatListProps = {
  items: readonly IconStatItem[];
  variant?: IconStatListVariant;
  color?: string;
};

export function IconStatList({ items, variant = "card", color }: IconStatListProps) {
  const customProperties = color ? ({ "--icon-stat-color": color } as CSSProperties) : undefined;

  return (
    <ul
      className={styles[`${variant}List`]}
      style={customProperties}
    >
      {items.map((item, index) => (
        <li key={index}>
          <span
            className={styles[`${variant}Item`]}
            aria-label={item.ariaLabel}
          >
            <span className={styles[`${variant}Icon`]}>{item.icon}</span>
            <span>{item.value}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
