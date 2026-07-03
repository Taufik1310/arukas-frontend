"use client";
import { Spinner } from "@/components/atoms/Spinner";
import { LowStockAlert }        from "@/features/dashboard/components/LowStockAlert";
import { SalesLineChart }       from "@/features/dashboard/components/SalesLineChart";
import { StatsGrid }            from "@/features/dashboard/components/StatsGrid";
import { TopProductsBarChart }  from "@/features/dashboard/components/TopProductsBarChart";
import { useDashboard }         from "@/features/dashboard/hooks/useDashboard";

export default function DashboardPage() {
  const { stats, salesData, topProds, chartType, setChartType, loading } = useDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" className="text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ringkasan penjualan dan performa toko</p>
      </div>

      <StatsGrid stats={stats} />
      <LowStockAlert count={stats?.low_stock_count ?? 0} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesLineChart data={salesData} type={chartType} onTypeChange={setChartType} />
        <TopProductsBarChart data={topProds} />
      </div>
    </div>
  );
}