import type { ReactNode } from "react";
import Link, { type LinkProps } from "next/link";
import { IoArrowForward } from "react-icons/io5";
import styles from "./ArrowTextLink.module.css";

type ArrowTextLinkProps = {
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
  href: LinkProps["href"];
};

export function ArrowTextLink({ ariaLabel, children, className, href }: ArrowTextLinkProps) {
  return (
    <Link
      className={[styles.link, className].filter(Boolean).join(" ")}
      href={href}
      aria-label={ariaLabel}
    >
      {children}
      <IoArrowForward
        className={styles.icon}
        aria-hidden="true"
      />
    </Link>
  );
}
