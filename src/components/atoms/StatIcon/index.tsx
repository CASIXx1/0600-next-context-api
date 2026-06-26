import type { IconType } from "react-icons";
import { IoDocument, IoGitCommit } from "react-icons/io5";

const STAT_ICONS = {
  milestone: IoGitCommit,
  document: IoDocument,
} as const satisfies Record<string, IconType>;

export type StatIconKey = keyof typeof STAT_ICONS;

type StatIconProps = {
  iconKey: StatIconKey;
  color?: string;
  size?: string;
};

export function StatIcon({ color, iconKey, size = "12px" }: StatIconProps) {
  const Icon = STAT_ICONS[iconKey];

  return (
    <Icon
      aria-hidden="true"
      color={color}
      size={size}
      style={{ color }}
    />
  );
}
