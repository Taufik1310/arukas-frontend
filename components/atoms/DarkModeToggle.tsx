"use client";
import { useTheme } from "@/context/ThemeContext";
import { cn }       from "@/lib/utils";
import {
  FiMonitor,
  FiMoon,
  FiSun,
} from "react-icons/fi";

// ── Variants ──────────────────────────────────────────────────────────────
type ToggleVariant = "icon" | "icon-label" | "segmented";

interface DarkModeToggleProps {
  variant?:   ToggleVariant;
  className?: string;
}

// ── Sub-components ────────────────────────────────────────────────────────

/** Hanya ikon bulat, cocok untuk header/navbar */
function IconToggle({ className }: { className?: string }) {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      title={isDark ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
      aria-label={isDark ? "Mode terang" : "Mode gelap"}
      className={cn(
        "w-9 h-9 flex items-center justify-center rounded-xl cursor-pointer",
        "border border-gray-200 dark:border-slate-600",
        "bg-white dark:bg-slate-800",
        "text-gray-500 dark:text-gray-400",
        "hover:bg-gray-50 dark:hover:bg-slate-700",
        "hover:text-gray-700 dark:hover:text-gray-200",
        "hover:border-gray-300 dark:hover:border-slate-500",
        "transition-all duration-200",
        className,
      )}
    >
      {isDark
        ? <FiSun  size={17} className="text-amber-500" />
        : <FiMoon size={17} className="text-slate-500" />
      }
    </button>
  );
}

/** Ikon + label teks, cocok untuk Sidebar */
function IconLabelToggle({ className }: { className?: string }) {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer",
        "text-gray-600 dark:text-gray-400",
        "hover:bg-gray-50 dark:hover:bg-slate-700",
        "hover:text-gray-900 dark:hover:text-white",
        className,
      )}
    >
      {isDark
        ? <FiSun  size={16} className="text-amber-500 shrink-0" />
        : <FiMoon size={16} className="shrink-0" />
      }
      <span>{isDark ? "Mode Terang" : "Mode Gelap"}</span>
    </button>
  );
}

/** Tiga pilihan: Light / System / Dark */
function SegmentedToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  const options = [
    { value: "light",  icon: <FiSun size={14} />,     label: "Terang"  },
    { value: "system", icon: <FiMonitor size={14} />,  label: "Sistem"  },
    { value: "dark",   icon: <FiMoon size={14} />,     label: "Gelap"   },
  ] as const;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 p-1 rounded-xl cursor-pointer",
        "bg-gray-100 dark:bg-slate-700",
        "border border-gray-200 dark:border-slate-600",
        className,
      )}
      role="radiogroup"
      aria-label="Pilih tema"
    >
      {options.map((opt) => {
        const isActive = theme === opt.value;
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={isActive}
            onClick={() => setTheme(opt.value)}
            title={opt.label}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
              isActive
                ? "bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
            )}
          >
            {opt.icon}
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────
export function DarkModeToggle({
  variant   = "icon",
  className,
}: DarkModeToggleProps) {
  switch (variant) {
    case "icon-label":  return <IconLabelToggle className={className} />;
    case "segmented":   return <SegmentedToggle className={className} />;
    default:            return <IconToggle className={className} />;
  }
}