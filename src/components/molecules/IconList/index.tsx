import type { CSSProperties, ReactNode } from "react";
import { Icon, type IconName } from "@/src/components/atoms/Icon";
import styles from "./index.module.css";

type IconListVariant = "card" | "detail";

export type IconListItem = {
  name: IconName;
  value: ReactNode;
  ariaLabel?: string;
};

type IconListProps = {
  items: readonly IconListItem[];
  variant?: IconListVariant;
  color?: string;
};

export function IconList({ items, variant = "card", color }: IconListProps) {
  const customProperties = color ? ({ "--icon-list-color": color } as CSSProperties) : undefined;

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
            <Icon
              name={item.name}
              color={color}
              className={styles[`${variant}Icon`]}
            />
            <span>{item.value}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
