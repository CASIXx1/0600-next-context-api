import type { AnchorHTMLAttributes, ReactNode } from "react";
import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import styles from "./index.module.css";

type LinkVariant = "text" | "plain";
type LinkShape = "default" | "circle";
type LinkSize = "small" | "medium";

type LinkProps = Omit<
  NextLinkProps & AnchorHTMLAttributes<HTMLAnchorElement>,
  "aria-label" | "children" | "className" | "href"
> & {
  ariaLabel?: string;
  children?: ReactNode;
  className?: string;
  endIcon?: ReactNode;
  href: NextLinkProps["href"];
  iconClassName?: string;
  shape?: LinkShape;
  size?: LinkSize;
  startIcon?: ReactNode;
  variant?: LinkVariant;
};

export function Link({
  ariaLabel,
  children,
  className,
  endIcon,
  iconClassName,
  shape = "default",
  size = "small",
  startIcon,
  variant = "text",
  ...props
}: LinkProps) {
  const linkClassName = [styles.root, styles[variant], styles[shape], styles[size], className]
    .filter(Boolean)
    .join(" ");
  const startIconClassName = [styles.icon, styles.startIcon, iconClassName].filter(Boolean).join(" ");
  const endIconClassName = [styles.icon, styles.endIcon, iconClassName].filter(Boolean).join(" ");

  return (
    <NextLink
      className={linkClassName}
      aria-label={ariaLabel}
      {...props}
    >
      {startIcon ? <span className={startIconClassName}>{startIcon}</span> : null}
      {children}
      {endIcon ? <span className={endIconClassName}>{endIcon}</span> : null}
    </NextLink>
  );
}
