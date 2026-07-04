"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// ── Types ─────────────────────────────────────────────────────────────────
type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme:        Theme;
  isDark:       boolean;
  setTheme:     (theme: Theme) => void;
  toggleTheme:  () => void;
}

// ── Context ───────────────────────────────────────────────────────────────
const ThemeContext = createContext<ThemeContextType | null>(null);

// ── Helpers ───────────────────────────────────────────────────────────────
function getSystemPreference(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(theme: Theme): boolean {
  const isDark = theme === "dark" || (theme === "system" && getSystemPreference());
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.setAttribute("data-theme", theme);
  return isDark;
}

function getSavedTheme(): Theme {
  if (typeof window === "undefined") return "system";
  return (localStorage.getItem("theme") as Theme) ?? "system";
}

// ── Provider ──────────────────────────────────────────────────────────────
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    return getSavedTheme();
  });
  const [systemDark, setSystemDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return getSystemPreference();
  });

  const isDark = theme === "dark" || (theme === "system" && systemDark);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, systemDark]);

  // Pantau perubahan system preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(isDark ? "light" : "dark");
  }, [isDark, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────
export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}