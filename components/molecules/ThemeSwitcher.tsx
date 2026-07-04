"use client";
import { useTheme } from "@/context/ThemeContext";
import { cn }       from "@/lib/utils";
import { FiMonitor, FiMoon, FiSun } from "react-icons/fi";

const OPTIONS = [
  {
    value: "light",
    icon:  <FiSun size={20} />,
    label: "Terang",
    desc:  "Tampilan terang",
  },
  {
    value: "system",
    icon:  <FiMonitor size={20} />,
    label: "Sistem",
    desc:  "Ikuti pengaturan OS",
  },
  {
    value: "dark",
    icon:  <FiMoon size={20} />,
    label: "Gelap",
    desc:  "Tampilan gelap",
  },
] as const;

type Theme = "light" | "dark" | "system";

interface ThemeSwitcherProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeSwitcher({
  className,
  showLabel = true,
}: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className={cn("space-y-2 cursor-pointer", className)}>
      {showLabel && (
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Tampilan
        </p>
      )}
      <div className="grid grid-cols-3 gap-2">
        {OPTIONS.map((opt) => {
          const isActive = theme === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setTheme(opt.value as Theme)}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                isActive
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "border-gray-200 dark:border-slate-600 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-slate-500 hover:bg-gray-50 dark:hover:bg-slate-700",
              )}
            >
              {opt.icon}
              <div className="text-center">
                <p className={cn(
                  "text-xs font-semibold",
                  isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300",
                )}>
                  {opt.label}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {opt.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}