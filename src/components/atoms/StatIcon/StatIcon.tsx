import type { IconType } from "react-icons";

type StatIconProps = {
  icon: IconType;
  color?: string;
  size?: string;
};

export function StatIcon({ color, icon: Icon, size = "12px" }: StatIconProps) {
  return (
    <Icon
      aria-hidden="true"
      color={color}
      size={size}
      style={{ color }}
    />
  );
}
