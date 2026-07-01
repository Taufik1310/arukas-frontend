"use client";
import { useAuth } from "@/context/AuthContext";
import { useDarkMode } from "@/hooks/useDarkMode";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  emoji: string;
  roles: Array<"admin" | "petugas">;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard",     label: "Dashboard",    emoji: "📊", roles: ["admin", "petugas"] },
  { href: "/pos",           label: "Kasir POS",    emoji: "🛒", roles: ["admin", "petugas"] },
  { href: "/products",      label: "Produk",       emoji: "📦", roles: ["admin", "petugas"] },
  { href: "/categories",    label: "Kategori",     emoji: "🏷️", roles: ["admin", "petugas"] },
  { href: "/suppliers",     label: "Supplier",     emoji: "🚚", roles: ["admin", "petugas"] },
  { href: "/purchases",     label: "Pembelian",    emoji: "📋", roles: ["admin", "petugas"] },
  { href: "/reports",       label: "Laporan",      emoji: "📈", roles: ["admin", "petugas"] },
  { href: "/activity-logs", label: "Activity Log", emoji: "📝", roles: ["admin", "petugas"] },
  { href: "/users",         label: "User",         emoji: "👥", roles: ["admin"] },
];

export default function Sidebar() {
  const { user, logout }  = useAuth();
  const { dark, toggle }  = useDarkMode();
  const pathname          = usePathname();

  // Filter menu berdasarkan role
  const navItems = NAV_ITEMS.filter((item) =>
    user?.role && item.roles.includes(user.role)
  );

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-60 shrink-0 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col h-screen sticky top-0 overflow-y-auto">

      {/* ── Brand ── */}
      <div className="px-4 py-4 border-b border-gray-200 dark:border-slate-700 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <span className="text-sm">🛒</span>
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
              POS System
            </p>
            <p className="text-xs text-gray-400 truncate">Point of Sales</p>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive(item.href)
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <span className="text-base shrink-0">{item.emoji}</span>
            <span className="flex-1 truncate">{item.label}</span>
            {/* Badge Admin untuk menu khusus admin */}
            {item.href === "/users" && (
              <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded font-medium shrink-0">
                Admin
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className="px-2 py-3 border-t border-gray-200 dark:border-slate-700 space-y-0.5 shrink-0">

        {/* Toggle Dark Mode */}
        <button
          onClick={toggle}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white transition-colors w-full text-left"
        >
          <span className="text-base">{dark ? "☀️" : "🌙"}</span>
          {dark ? "Mode Terang" : "Mode Gelap"}
        </button>

        {/* Info User + Tombol Logout */}
        <div className="flex items-center gap-3 px-3 py-2">
          {/* Avatar inisial */}
          <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
              {user?.name?.[0]?.toUpperCase() ?? "?"}
            </span>
          </div>
          {/* Nama & Role */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
          {/* Tombol Logout */}
          <button
            onClick={logout}
            title="Keluar"
            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors shrink-0"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}