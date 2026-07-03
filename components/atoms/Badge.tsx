import { cn } from "@/lib/utils";

type BadgeVariant = "green" | "blue" | "red" | "amber" | "gray" | "purple";

const VARIANTS: Record<BadgeVariant, string> = {
  green:  "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  blue:   "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  red:    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  amber:  "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  gray:   "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300",
  purple: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "gray", children, className }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
      VARIANTS[variant], className,
    )}>
      {children}
    </span>
  );
}