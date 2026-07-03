"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface NavItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  badge?: ReactNode;
}

export function NavItem({ href, icon, label, badge }: NavItemProps) {
  const pathname  = usePathname();
  const isActive  = href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <Link href={href} className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
      isActive
        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white",
    )}>
      <span className={cn("shrink-0 transition-colors", isActive && "text-blue-600 dark:text-blue-400")}>
        {icon}
      </span>
      <span className="flex-1 truncate">{label}</span>
      {badge}
    </Link>
  );
}