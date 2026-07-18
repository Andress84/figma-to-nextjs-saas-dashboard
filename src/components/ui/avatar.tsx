import Image, { type ImageProps } from "next/image";
import { UserRound } from "lucide-react";
import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type AvatarSize = "small" | "medium" | "large";
export type AvatarFallback = "initials" | "icon";

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  decorative?: boolean;
  fallback?: AvatarFallback;
  imageSrc?: ImageProps["src"];
  initials?: string;
  name: string;
  size?: AvatarSize;
}

const avatarDimensions = {
  small: 28,
  medium: 36,
  large: 44,
} satisfies Record<AvatarSize, number>;

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => Array.from(part)[0] ?? "")
    .join("")
    .toLocaleUpperCase();
}

function limitInitials(initials: string) {
  return Array.from(initials.trim()).slice(0, 2).join("").toLocaleUpperCase();
}

export function Avatar({
  className,
  decorative = false,
  fallback = "initials",
  imageSrc,
  initials,
  name,
  size = "medium",
  ...avatarProps
}: Readonly<AvatarProps>) {
  const visibleInitials = limitInitials(initials ?? getInitials(name));
  const shouldShowIcon = fallback === "icon" || visibleInitials.length === 0;
  const dimension = avatarDimensions[size];
  const accessibilityProps = decorative
    ? { "aria-hidden": true }
    : imageSrc
      ? {}
      : { "aria-label": name, role: "img" };

  return (
    <span
      {...avatarProps}
      {...accessibilityProps}
      className={cn("ui-avatar", `ui-avatar--${size}`, className)}
    >
      {imageSrc ? (
        <Image
          className="ui-avatar-image"
          src={imageSrc}
          alt={decorative ? "" : name}
          width={dimension}
          height={dimension}
        />
      ) : shouldShowIcon ? (
        <UserRound className="ui-avatar-fallback-icon" aria-hidden="true" />
      ) : (
        <span aria-hidden="true">{visibleInitials}</span>
      )}
    </span>
  );
}
