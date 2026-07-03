"use client";
import { Avatar } from "@/components/atoms/Avatar";
import { NavItem } from "./NavItem";
import { useAuth } from "@/context/AuthContext";
import { useDarkMode } from "@/hooks/useDarkMode";
import {
  FiActivity, FiBarChart2, FiClipboard, FiGrid,
  FiLogOut, FiMoon, FiPackage, FiShield,
  FiShoppingCart, FiSun, FiTag, FiTruck, FiUsers,
} from "react-icons/fi";
import { JSX } from "react/jsx-runtime";

const NAV: {
  href: string;
  icon: JSX.Element;
  label: string;
  roles: ("admin" | "petugas")[];
  badge?: JSX.Element;
}[] = [
  { href: "/dashboard",     icon: <FiGrid size={16} />,       label: "Dashboard",    roles: ["admin","petugas"] },
  { href: "/pos",           icon: <FiShoppingCart size={16}/>, label: "Kasir POS",    roles: ["admin","petugas"] },
  { href: "/products",      icon: <FiPackage size={16} />,    label: "Produk",       roles: ["admin","petugas"] },
  { href: "/categories",    icon: <FiTag size={16} />,         label: "Kategori",     roles: ["admin","petugas"] },
  { href: "/suppliers",     icon: <FiTruck size={16} />,       label: "Supplier",     roles: ["admin","petugas"] },
  { href: "/purchases",     icon: <FiClipboard size={16} />,   label: "Pembelian",    roles: ["admin","petugas"] },
  { href: "/reports",       icon: <FiBarChart2 size={16} />,   label: "Laporan",      roles: ["admin","petugas"] },
  { href: "/activity-logs", icon: <FiActivity size={16} />,    label: "Activity Log", roles: ["admin","petugas"] },
  { href: "/users",         icon: <FiUsers size={16} />,       label: "User",         roles: ["admin"],
    badge: (
      <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
        <FiShield size={9} /> Admin
      </span>
    ),
  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useDarkMode();

  const links = NAV.filter((n) => n.roles.includes((user?.role ?? "petugas") as "admin" | "petugas"));

  return (
    <aside className="w-60 shrink-0 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col h-screen sticky top-0 overflow-y-auto">
      {/* Brand */}
      <div className="px-4 py-4 border-b border-gray-200 dark:border-slate-700 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <FiShoppingCart size={15} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm text-gray-900 dark:text-white truncate">POS System</p>
            <p className="text-xs text-gray-400 truncate">Point of Sales</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {links.map((item) => (
          <NavItem key={item.href} href={item.href} icon={item.icon} label={item.label}
            badge={"badge" in item ? item.badge : undefined} />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-gray-200 dark:border-slate-700 space-y-0.5 shrink-0">
        <button onClick={toggle}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white transition-colors w-full text-left">
          {dark ? <FiSun size={16} /> : <FiMoon size={16} />}
          {dark ? "Mode Terang" : "Mode Gelap"}
        </button>
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar name={user?.name} src={user?.avatar} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
          <button onClick={logout} title="Keluar"
            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors shrink-0">
            <FiLogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}