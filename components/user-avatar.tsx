import { cn, generateAvatarFallback } from "@/lib/utils";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarIndicator,
  AvatarIndicatorProps
} from "./ui/avatar";

type AvatarProps = {
  image?: string;
  indicator?: AvatarIndicatorProps["variant"];
  fallback?: string;
  className?: string;
};

export default function UserAvatar({ image, indicator, fallback = "AB", className }: AvatarProps) {
  return (
    <Avatar className={cn("h-15 w-15", className)}>
      <AvatarImage src={image ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${image}` : undefined} alt="avatar image" />
      <AvatarIndicator variant={indicator} />
      <AvatarFallback>{generateAvatarFallback(fallback)}</AvatarFallback>
    </Avatar>
  );
}
