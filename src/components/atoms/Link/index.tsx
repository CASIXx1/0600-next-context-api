import type { AnchorHTMLAttributes, ReactNode } from "react";
import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import { Icon, type IconName } from "@/src/components/atoms/Icon";
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
  endIconName?: IconName;
  href: NextLinkProps["href"];
  iconClassName?: string;
  shape?: LinkShape;
  size?: LinkSize;
  startIcon?: ReactNode;
  startIconName?: IconName;
  variant?: LinkVariant;
};

export function Link({
  ariaLabel,
  children,
  className,
  endIcon,
  endIconName,
  iconClassName,
  shape = "default",
  size = "small",
  startIcon,
  startIconName,
  variant = "text",
  ...props
}: LinkProps) {
  const linkClassName = [styles.root, styles[variant], styles[shape], styles[size], className]
    .filter(Boolean)
    .join(" ");
  const startIconClassName = [styles.icon, styles.startIcon, iconClassName].filter(Boolean).join(" ");
  const endIconClassName = [styles.icon, styles.endIcon, iconClassName].filter(Boolean).join(" ");
  const startIconContent = startIconName ? <Icon name={startIconName} /> : startIcon;
  const endIconContent = endIconName ? <Icon name={endIconName} /> : endIcon;

  return (
    <NextLink
      className={linkClassName}
      aria-label={ariaLabel}
      {...props}
    >
      {startIconContent ? <span className={startIconClassName}>{startIconContent}</span> : null}
      {children}
      {endIconContent ? <span className={endIconClassName}>{endIconContent}</span> : null}
    </NextLink>
  );
}
