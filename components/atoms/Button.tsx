"use client";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { Spinner } from "./Spinner";

type Variant = "primary" | "secondary" | "danger" | "success" | "outline" | "ghost";
type Size    = "xs" | "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:   "bg-blue-600 hover:bg-blue-700 text-white",
  secondary: "bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200",
  danger:    "bg-red-600 hover:bg-red-700 text-white",
  success:   "bg-emerald-600 hover:bg-emerald-700 text-white",
  outline:   "border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300",
  ghost:     "hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400",
};

const SIZES: Record<Size, string> = {
  xs: "text-xs px-2 py-1",
  sm: "text-xs px-3 py-1.5",
  md: "text-sm px-4 py-2",
  lg: "text-sm px-6 py-3",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = "primary", size = "md", loading = false,
  fullWidth = false, leftIcon, rightIcon,
  children, className, disabled, ...props
}, ref) => (
  <button
    ref={ref}
    disabled={disabled || loading}
    className={cn(
      "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
      VARIANTS[variant], SIZES[size],
      fullWidth && "w-full",
      className,
    )}
    {...props}
  >
    {loading
      ? <Spinner size="sm" />
      : leftIcon && <span className="shrink-0">{leftIcon}</span>
    }
    {children}
    {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
  </button>
));
Button.displayName = "Button";