import Link, { type LinkProps } from "next/link";
import { IoArrowForward } from "react-icons/io5";
import { CircleIconLink } from "@/src/components/atoms/CircleIconLink";

type CircleArrowLinkProps = {
  ariaLabel: string;
  className?: string;
  href: LinkProps["href"];
  iconClassName?: string;
};

export function CircleArrowLink({ ariaLabel, className, href, iconClassName }: CircleArrowLinkProps) {
  return (
    <CircleIconLink
      ariaLabel={ariaLabel}
      className={className}
      iconClassName={iconClassName}
      renderLink={(linkProps) => (
        <Link
          {...linkProps}
          href={href}
        />
      )}
    >
      <IoArrowForward aria-hidden="true" />
    </CircleIconLink>
  );
}
