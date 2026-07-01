"use client";
import { dashboardApi } from "@/lib/api";
import { formatRupiah } from "@/lib/utils";
import { DashboardStats } from "@/types";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartPoint {
  date?: string;
  month?: string;
  total: number;
  count: number;
}

interface TopProduct {
  name: string;
  total_qty: number;
  total_revenue: number;
}

// ── Komponen Stat Card ────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: string;
  color: string;
}) {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          {sub && (
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
          )}
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
}

// ── Halaman Dashboard ─────────────────────────────────────────────────────
export default function DashboardPage() {
  const [stats,     setStats]     = useState<DashboardStats | null>(null);
  const [salesData, setSalesData] = useState<ChartPoint[]>([]);
  const [topProds,  setTopProds]  = useState<TopProduct[]>([]);
  const [chartType, setChartType] = useState<"daily" | "monthly">("daily");
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      setLoading(true);
      try {
        const [s, c, t] = await Promise.all([
          dashboardApi.stats(),
          dashboardApi.salesChart({ type: chartType }),
          dashboardApi.topProducts({ limit: 8 }),
        ]);
        if (!mounted) return;
        setStats(s.data.data);
        setSalesData(c.data.data);
        setTopProds(t.data.data);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [chartType]);

  // Buat label sumbu X berdasarkan tipe grafik
  const chartLabels = salesData.map((d) => {
    const val = d.date ?? d.month ?? "";
    if (chartType === "monthly") {
      const [y, m] = val.split("-");
      return new Date(+y, +m - 1).toLocaleDateString("id-ID", {
        month: "short",
        year: "2-digit",
      });
    }
    return new Date(val).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Ringkasan penjualan dan performa toko
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Penjualan Hari Ini"
          value={formatRupiah(stats?.today_sales ?? 0)}
          sub={`${stats?.today_transactions ?? 0} transaksi`}
          icon="💰"
          color="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          label="Penjualan Bulan Ini"
          value={formatRupiah(stats?.month_sales ?? 0)}
          sub={`${stats?.growth_percent ?? 0}% vs bulan lalu`}
          icon="📈"
          color="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          label="Total Produk"
          value={stats?.total_products ?? 0}
          sub={`${stats?.low_stock_count ?? 0} stok rendah`}
          icon="📦"
          color="text-gray-900 dark:text-white"
        />
        <StatCard
          label="Pembelian Pending"
          value={stats?.pending_purchases ?? 0}
          icon="📋"
          color="text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* Alert stok rendah */}
      {(stats?.low_stock_count ?? 0) > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3">
          <span className="text-xl shrink-0">⚠️</span>
          <p className="text-sm text-amber-800 dark:text-amber-300">
            <strong>{stats!.low_stock_count} produk</strong> memiliki stok di
            bawah minimum.{" "}
            <a
              href="/products?low_stock=1"
              className="underline font-medium hover:no-underline"
            >
              Lihat produk →
            </a>
          </p>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Grafik Penjualan */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Grafik Penjualan
            </h3>
            <div className="flex gap-1">
              {(["daily", "monthly"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setChartType(t)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                    chartType === t
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {t === "daily" ? "Harian" : "Bulanan"}
                </button>
              ))}
            </div>
          </div>
          {salesData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              Belum ada data penjualan
            </div>
          ) : (
            <Line
              data={{
                labels: chartLabels,
                datasets: [
                  {
                    label: "Pendapatan",
                    data: salesData.map((d) => d.total),
                    borderColor: "#3b82f6",
                    backgroundColor: "rgba(59,130,246,0.1)",
                    borderWidth: 2,
                    pointRadius: 3,
                    tension: 0.4,
                    fill: true,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                  y: {
                    ticks: {
                      callback: (v) =>
                        "Rp " + (Number(v) / 1000).toFixed(0) + "K",
                      font: { size: 10 },
                    },
                    grid: { color: "rgba(0,0,0,0.05)" },
                  },
                  x: {
                    ticks: { font: { size: 10 } },
                    grid: { display: false },
                  },
                },
              }}
            />
          )}
        </div>

        {/* Produk Terlaris */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Produk Terlaris
          </h3>
          {topProds.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              Belum ada data penjualan
            </div>
          ) : (
            <Bar
              data={{
                labels: topProds.map((p) =>
                  p.name.length > 18
                    ? p.name.slice(0, 18) + "…"
                    : p.name
                ),
                datasets: [
                  {
                    label: "Terjual (unit)",
                    data: topProds.map((p) => p.total_qty),
                    backgroundColor: "rgba(16,185,129,0.8)",
                    borderRadius: 4,
                  },
                ],
              }}
              options={{
                indexAxis: "y",
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                  x: {
                    ticks: { font: { size: 10 } },
                    grid: { color: "rgba(0,0,0,0.05)" },
                  },
                  y: {
                    ticks: { font: { size: 10 } },
                    grid: { display: false },
                  },
                },
              }}
            />
          )}
        </div>
      </div>

      {/* Baris Stat Bawah */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-sm text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Kategori</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
            {stats?.total_categories ?? 0}
          </p>
        </div>
        <div className="card-sm text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Supplier</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
            {stats?.total_suppliers ?? 0}
          </p>
        </div>
        <div className="card-sm text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Total User
          </p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
            {stats?.total_users ?? 0}
          </p>
        </div>
        <div className="card-sm text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Stok Rendah
          </p>
          <p className="text-xl font-bold text-red-500 mt-1">
            {stats?.low_stock_count ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
}