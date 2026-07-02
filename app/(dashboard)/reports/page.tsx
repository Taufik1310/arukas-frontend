"use client";
import Pagination from "@/components/ui/Pagination";
import { dashboardApi, reportApi } from "@/lib/api";
import {
  downloadBlob,
  formatDate,
  formatRupiah,
  getFirstDayOfMonth,
  getToday,
} from "@/lib/utils";
import { PaginationMeta, SaleTransaction } from "@/types";
import {
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
import { useCallback, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import toast from "react-hot-toast";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Summary {
  total_transaksi:  number;
  total_pendapatan: number;
  total_diskon:     number;
}

interface ChartPoint {
  date:  string;
  total: number;
  count: number;
}

const STATUS_BADGE: Record<string, string> = {
  paid:    "badge-green",
  pending: "badge-amber",
  failed:  "badge-red",
};

const METHOD_BADGE: Record<string, string> = {
  cash:     "badge-gray",
  transfer: "badge-blue",
  midtrans: "badge-purple",
};

export default function ReportsPage() {
  const [sales,   setSales]   = useState<SaleTransaction[]>([]);
  const [meta,    setMeta]    = useState<PaginationMeta | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [chart,   setChart]   = useState<ChartPoint[]>([]);
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState<"excel" | "pdf" | null>(null);

  const [filter, setFilter] = useState({
    start_date:     getFirstDayOfMonth(),
    end_date:       getToday(),
    payment_status: "",
    payment_method: "",
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [rpt, chartData] = await Promise.all([
        reportApi.sales({ ...filter, page }),
        dashboardApi.salesChart({ type: "daily" }),
      ]);
      setSales(rpt.data.data);
      setMeta(rpt.data.meta);
      setSummary(rpt.data.summary);
      setChart(chartData.data.data);
    } catch {
      toast.error("Gagal memuat laporan");
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

   useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchData]);

  const setF =
    (key: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setFilter((prev) => ({ ...prev, [key]: e.target.value }));

  const handleExport = async (type: "excel" | "pdf") => {
    setExporting(type);
    try {
      const { data } = await reportApi.exportSales({ ...filter, type });
      const ext      = type === "excel" ? "xlsx" : "pdf";
      downloadBlob(
        data,
        `laporan-penjualan-${filter.start_date}-sd-${filter.end_date}.${ext}`
      );
      toast.success(`Export ${type.toUpperCase()} berhasil diunduh`);
    } catch {
      toast.error("Export gagal");
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Laporan Penjualan</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Ringkasan dan detail transaksi penjualan
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport("excel")}
            disabled={exporting !== null}
            className="btn-outline btn-sm disabled:opacity-60"
          >
            {exporting === "excel" ? "..." : "⬇ Excel"}
          </button>
          <button
            onClick={() => handleExport("pdf")}
            disabled={exporting !== null}
            className="btn-outline btn-sm disabled:opacity-60"
          >
            {exporting === "pdf" ? "..." : "⬇ PDF"}
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="card">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Filter Laporan
        </p>
        <div className="flex flex-wrap gap-3">
          <div>
            <label className="label text-xs">Dari Tanggal</label>
            <input
              type="date"
              className="input text-sm"
              value={filter.start_date}
              onChange={setF("start_date")}
            />
          </div>
          <div>
            <label className="label text-xs">Sampai Tanggal</label>
            <input
              type="date"
              className="input text-sm"
              value={filter.end_date}
              onChange={setF("end_date")}
            />
          </div>
          <div>
            <label className="label text-xs">Status Pembayaran</label>
            <select
              className="input text-sm"
              value={filter.payment_status}
              onChange={setF("payment_status")}
            >
              <option value="">Semua Status</option>
              <option value="paid">Lunas</option>
              <option value="pending">Pending</option>
              <option value="failed">Gagal</option>
            </select>
          </div>
          <div>
            <label className="label text-xs">Metode Pembayaran</label>
            <select
              className="input text-sm"
              value={filter.payment_method}
              onChange={setF("payment_method")}
            >
              <option value="">Semua Metode</option>
              <option value="cash">Tunai</option>
              <option value="transfer">Transfer</option>
              <option value="midtrans">Online (Midtrans)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Transaksi
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {summary.total_transaksi}
            </p>
            <p className="text-xs text-gray-400 mt-1">transaksi</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Pendapatan
            </p>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {formatRupiah(summary.total_pendapatan)}
            </p>
            <p className="text-xs text-gray-400 mt-1">dari transaksi lunas</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Diskon
            </p>
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">
              {formatRupiah(summary.total_diskon)}
            </p>
            <p className="text-xs text-gray-400 mt-1">diberikan ke pelanggan</p>
          </div>
        </div>
      )}

      {/* Grafik */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Grafik Penjualan Harian (30 Hari Terakhir)
        </h3>
        {chart.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
            Belum ada data untuk ditampilkan
          </div>
        ) : (
          <Line
            data={{
              labels: chart.map((d) =>
                new Date(d.date).toLocaleDateString("id-ID", {
                  day:   "numeric",
                  month: "short",
                })
              ),
              datasets: [
                {
                  label:           "Pendapatan",
                  data:            chart.map((d) => d.total),
                  borderColor:     "#3b82f6",
                  backgroundColor: "rgba(59,130,246,0.1)",
                  borderWidth:     2,
                  pointRadius:     3,
                  tension:         0.4,
                  fill:            true,
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
                    font: { size: 11 },
                  },
                  grid: { color: "rgba(0,0,0,0.05)" },
                },
                x: {
                  ticks: { font: { size: 11 } },
                  grid: { display: false },
                },
              },
            }}
          />
        )}
      </div>

      {/* Tabel Detail */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Detail Transaksi
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="th">Kode</th>
                <th className="th">Kasir</th>
                <th className="th">Pelanggan</th>
                <th className="th text-right">Total</th>
                <th className="th">Metode</th>
                <th className="th">Status</th>
                <th className="th">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                      Memuat...
                    </div>
                  </td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-gray-400 text-sm">
                    Tidak ada transaksi pada periode ini
                  </td>
                </tr>
              ) : (
                sales.map((s) => (
                  <tr key={s.id} className="tr">
                    <td className="td">
                      <span className="font-mono text-xs font-semibold text-gray-900 dark:text-white">
                        {s.code}
                      </span>
                    </td>
                    <td className="td text-gray-600 dark:text-gray-400">
                      {s.user?.name ?? "-"}
                    </td>
                    <td className="td text-gray-600 dark:text-gray-400">
                      {s.customer_name ?? (
                        <span className="text-gray-400 italic">Umum</span>
                      )}
                    </td>
                    <td className="td text-right font-semibold text-gray-900 dark:text-white">
                      {formatRupiah(s.total_amount)}
                    </td>
                    <td className="td">
                      <span className={METHOD_BADGE[s.payment_method] ?? "badge-gray"}>
                        {s.payment_method}
                      </span>
                    </td>
                    <td className="td">
                      <span className={STATUS_BADGE[s.payment_status] ?? "badge-gray"}>
                        {s.payment_status}
                      </span>
                    </td>
                    <td className="td text-xs text-gray-400 whitespace-nowrap">
                      {formatDate(s.created_at, true)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {meta && (
          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            total={meta.total}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}