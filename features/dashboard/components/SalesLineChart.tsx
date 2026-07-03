"use client";
import { Button } from "@/components/atoms/Button";
import {
  CategoryScale, Chart as ChartJS, Filler, Legend,
  LinearScale, LineElement, PointElement, Title, Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface DataPoint { date?: string; month?: string; total: number; count: number }
interface Props {
  data: DataPoint[];
  type: "daily" | "monthly";
  onTypeChange: (t: "daily" | "monthly") => void;
}

export function SalesLineChart({ data, type, onTypeChange }: Props) {
  const labels = data.map((d) => {
    const val = d.date ?? d.month ?? "";
    if (type === "monthly") {
      const [y, m] = val.split("-");
      return new Date(+y, +m - 1).toLocaleDateString("id-ID", { month: "short", year: "2-digit" });
    }
    return new Date(val).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  });

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Grafik Penjualan</h3>
        <div className="flex gap-1">
          {(["daily", "monthly"] as const).map((t) => (
            <Button key={t} variant={type === t ? "primary" : "ghost"} size="xs" onClick={() => onTypeChange(t)}>
              {t === "daily" ? "Harian" : "Bulanan"}
            </Button>
          ))}
        </div>
      </div>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Belum ada data</div>
      ) : (
        <Line
          data={{
            labels,
            datasets: [{
              label: "Pendapatan", data: data.map((d) => d.total),
              borderColor: "#3b82f6", backgroundColor: "rgba(59,130,246,0.1)",
              borderWidth: 2, pointRadius: 3, tension: 0.4, fill: true,
            }],
          }}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              y: { ticks: { callback: (v) => "Rp " + (Number(v)/1000).toFixed(0) + "K", font: { size: 10 } }, grid: { color: "rgba(0,0,0,0.05)" } },
              x: { ticks: { font: { size: 10 } }, grid: { display: false } },
            },
          }}
        />
      )}
    </div>
  );
}