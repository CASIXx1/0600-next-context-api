import type { IconType } from "react-icons";
import { IoDocument, IoGitCommit } from "react-icons/io5";

const ICONS = {
  milestone: IoGitCommit,
  document: IoDocument,
} as const satisfies Record<string, IconType>;

export type IconName = keyof typeof ICONS;

type IconProps = {
  name: IconName;
  color?: string;
  size?: string;
  className?: string;
};

export function Icon({ className, color, name, size = "12px" }: IconProps) {
  const IconComponent = ICONS[name];

  return (
    <IconComponent
      aria-hidden="true"
      className={className}
      color={color}
      size={size}
      style={{ color }}
    />
  );
}
