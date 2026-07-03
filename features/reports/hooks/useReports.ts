"use client";
import { dashboardApi, reportApi } from "@/lib/api";
import { PaginationMeta, SaleTransaction } from "@/types";
import { downloadBlob, getFirstDayOfMonth, getToday } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface ReportFilter {
  start_date:     string;
  end_date:       string;
  payment_status: string;
  payment_method: string;
}

export interface ReportSummaryData {
  total_transaksi:  number;
  total_pendapatan: number;
  total_diskon:     number;
}

export interface ChartPoint {
  date:  string;
  total: number;
  count: number;
}

export function useReports() {
  const [sales,     setSales]     = useState<SaleTransaction[]>([]);
  const [meta,      setMeta]      = useState<PaginationMeta | null>(null);
  const [summary,   setSummary]   = useState<ReportSummaryData | null>(null);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [page,      setPage]      = useState(1);
  const [loading,   setLoading]   = useState(false);
  const [exporting, setExporting] = useState<"excel" | "pdf" | null>(null);

  const [filter, setFilter] = useState<ReportFilter>({
    start_date:     getFirstDayOfMonth(),
    end_date:       getToday(),
    payment_status: "",
    payment_method: "",
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [rpt, chart] = await Promise.all([
        reportApi.sales({ ...filter, page }),
        dashboardApi.salesChart({ type: "daily" }),
      ]);
      setSales(rpt.data.data);
      setMeta(rpt.data.meta);
      setSummary(rpt.data.summary);
      setChartData(chart.data.data);
    } catch { toast.error("Gagal memuat laporan"); }
    finally  { setLoading(false); }
  }, [filter, page]);

  useEffect(() => {
    void Promise.resolve().then(fetchData);
  }, [fetchData]);

  const updateFilter = (key: keyof ReportFilter, value: string) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleExport = async (type: "excel" | "pdf") => {
    setExporting(type);
    try {
      const { data } = await reportApi.exportSales({ ...filter, type });
      const ext = type === "excel" ? "xlsx" : "pdf";
      downloadBlob(data, `laporan-${filter.start_date}-sd-${filter.end_date}.${ext}`);
      toast.success(`Export ${type.toUpperCase()} berhasil diunduh`);
    } catch { toast.error("Export gagal"); }
    finally  { setExporting(null); }
  };

  return {
    sales, meta, summary, chartData,
    page, loading, exporting, filter,
    setPage, updateFilter, handleExport,
  };
}