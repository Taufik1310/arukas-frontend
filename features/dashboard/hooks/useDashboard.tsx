"use client";
import { dashboardApi } from "@/lib/api";
import { DashboardStats } from "@/types";
import { useEffect, useState } from "react";

interface ChartPoint { date?: string; month?: string; total: number; count: number }
interface TopProduct  { name: string; total_qty: number; total_revenue: number }

export function useDashboard() {
  const [stats,     setStats]     = useState<DashboardStats | null>(null);
  const [salesData, setSalesData] = useState<ChartPoint[]>([]);
  const [topProds,  setTopProds]  = useState<TopProduct[]>([]);
  const [chartType, setChartType] = useState<"daily" | "monthly">("daily");
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      setLoading(true);

      try {
        const [s, c, t] = await Promise.all([
          dashboardApi.stats(),
          dashboardApi.salesChart({ type: chartType }),
          dashboardApi.topProducts({ limit: 8 }),
        ]);

        if (!active) return;

        setStats(s.data.data);
        setSalesData(c.data.data);
        setTopProds(t.data.data);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [chartType]);

  return { stats, salesData, topProds, chartType, setChartType, loading };
}