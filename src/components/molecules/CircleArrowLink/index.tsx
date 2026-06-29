import type { LinkProps } from "next/link";
import { Link } from "@/src/components/atoms/Link";

type CircleArrowLinkProps = {
  ariaLabel: string;
  className?: string;
  href: LinkProps["href"];
  iconClassName?: string;
};

export function CircleArrowLink({ ariaLabel, className, href, iconClassName }: CircleArrowLinkProps) {
  return (
    <Link
      href={href}
      ariaLabel={ariaLabel}
      className={className}
      endIconName="arrowForward"
      iconClassName={iconClassName}
      shape="circle"
      size="medium"
      variant="plain"
    />
  );
}
