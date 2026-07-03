import { cn } from "@/lib/utils";
import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  success?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, success, className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-lg border bg-white dark:bg-slate-700",
        "text-gray-900 dark:text-white px-3 py-2.5 text-sm",
        "placeholder-gray-400 dark:placeholder-slate-400",
        "focus:outline-none focus:ring-2 focus:border-transparent transition",
        error
          ? "border-red-400 focus:ring-red-400"
          : success
          ? "border-green-400 focus:ring-green-400"
          : "border-gray-200 dark:border-slate-600 focus:ring-blue-500",
        className,
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";