import { StatCard } from "@/components/molecules/StatCard";
import { formatRupiah } from "@/lib/utils";
import { DashboardStats } from "@/types";
import { FiPackage, FiClipboard, FiTrendingUp } from "react-icons/fi";
import { BiDollarCircle } from "react-icons/bi";

interface Props { stats: DashboardStats | null }

export function StatsGrid({ stats }: Props) {
  const items = [
    {
      label: "Penjualan Hari Ini",
      value: formatRupiah(stats?.today_sales ?? 0),
      sub: `${stats?.today_transactions ?? 0} transaksi`,
      icon: <BiDollarCircle size={20} className="text-blue-600" />,
      iconBg: "bg-blue-50 dark:bg-blue-900/30",
      valueColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Penjualan Bulan Ini",
      value: formatRupiah(stats?.month_sales ?? 0),
      sub: `${stats?.growth_percent ?? 0}% vs bulan lalu`,
      icon: <FiTrendingUp size={20} className="text-emerald-600" />,
      iconBg: "bg-emerald-50 dark:bg-emerald-900/30",
      valueColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Total Produk",
      value: stats?.total_products ?? 0,
      sub: `${stats?.low_stock_count ?? 0} stok rendah`,
      icon: <FiPackage size={20} className="text-gray-600 dark:text-gray-400" />,
      iconBg: "bg-gray-100 dark:bg-slate-700",
    },
    {
      label: "Pembelian Pending",
      value: stats?.pending_purchases ?? 0,
      icon: <FiClipboard size={20} className="text-amber-600" />,
      iconBg: "bg-amber-50 dark:bg-amber-900/30",
      valueColor: "text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => <StatCard key={item.label} {...item} />)}
    </div>
  );
}