"use client";
import { Avatar }         from "@/components/atoms/Avatar";
import { DarkModeToggle } from "@/components/atoms/DarkModeToggle";
import { useAuth }        from "@/context/AuthContext";
import { FiBell }         from "react-icons/fi";

interface DashboardHeaderProps {
  title?: string;
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-10">
      {title && (
        <p className="font-semibold text-gray-900 dark:text-white text-sm">
          {title}
        </p>
      )}

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifikasi */}
        <button
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors relative"
          title="Notifikasi"
        >
          <FiBell size={17} />
          {/* Badge notifikasi */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Dark Mode Toggle — variant icon */}
        <DarkModeToggle variant="icon" />

        {/* Avatar user */}
        <Avatar name={user?.name} src={user?.avatar} size="sm" />
      </div>
    </header>
  );
}