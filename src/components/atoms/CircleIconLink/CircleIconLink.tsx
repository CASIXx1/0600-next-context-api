import type { ReactNode } from "react";
import Link, { type LinkProps } from "next/link";
import styles from "./CircleIconLink.module.css";

type CircleIconLinkProps = {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  href: LinkProps["href"];
  iconClassName?: string;
};

export function CircleIconLink({ ariaLabel, children, className, href, iconClassName }: CircleIconLinkProps) {
  return (
    <Link
      className={[styles.link, className].filter(Boolean).join(" ")}
      href={href}
      aria-label={ariaLabel}
    >
      <span className={[styles.icon, iconClassName].filter(Boolean).join(" ")}>{children}</span>
    </Link>
  );
}
