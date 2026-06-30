import type { MouseEvent, ReactNode } from "react";
import Link from "next/link";
import styles from "./index.module.css";

type PageButtonLinkProps = {
  ariaLabel?: string;
  children: ReactNode;
  href: string;
  isActive?: boolean;
  isArrow?: boolean;
  isDisabled?: boolean;
};

export function PageButtonLink({
  ariaLabel,
  children,
  href,
  isActive = false,
  isArrow = false,
  isDisabled = false,
}: PageButtonLinkProps) {
  const className = [styles.pageButton, isActive ? styles.activePage : "", isArrow ? styles.arrowButton : ""]
    .filter(Boolean)
    .join(" ");

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isDisabled) {
      return;
    }

    event.preventDefault();
  };

  return (
    <Link
      className={className}
      aria-current={isActive ? "page" : undefined}
      aria-disabled={isDisabled || undefined}
      aria-label={ariaLabel}
      href={href}
      onClick={handleClick}
      tabIndex={isDisabled ? -1 : undefined}
    >
      {children}
    </Link>
  );
}
