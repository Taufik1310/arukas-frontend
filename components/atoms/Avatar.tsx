import Image from "next/image";
import { cn } from "@/lib/utils";

const sizes = { sm: "w-7 h-7 text-xs", md: "w-9 h-9 text-sm", lg: "w-12 h-12 text-base" };

interface AvatarProps {
  name?: string | null;
  src?: string | null;
  size?: keyof typeof sizes;
  className?: string;
}

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  if (src) {
    return (
      <div className={cn("relative rounded-full overflow-hidden shrink-0", sizes[size], className)}>
        <Image src={src} alt={name ?? ""} fill className="object-cover" />
      </div>
    );
  }
  return (
    <div className={cn(
      "rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0",
      sizes[size], className,
    )}>
      <span className="font-bold text-blue-600 dark:text-blue-400">
        {name?.[0]?.toUpperCase() ?? "?"}
      </span>
    </div>
  );
}