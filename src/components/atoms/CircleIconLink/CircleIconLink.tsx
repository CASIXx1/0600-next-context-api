import type { ReactNode } from "react";
import styles from "./CircleIconLink.module.css";

type CircleIconLinkRenderProps = {
  "aria-label": string;
  children: ReactNode;
  className: string;
};

type CircleIconLinkProps = {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  iconClassName?: string;
  renderLink: (props: CircleIconLinkRenderProps) => ReactNode;
};

export function CircleIconLink({ ariaLabel, children, className, iconClassName, renderLink }: CircleIconLinkProps) {
  return renderLink({
    "aria-label": ariaLabel,
    className: [styles.link, className].filter(Boolean).join(" "),
    children: <span className={[styles.icon, iconClassName].filter(Boolean).join(" ")}>{children}</span>,
  });
}
