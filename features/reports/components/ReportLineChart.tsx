"use client";
import {
  CategoryScale, Chart as ChartJS, Filler,
  Legend, LinearScale, LineElement,
  PointElement, Title, Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ChartPoint } from "../hooks/useReports";

ChartJS.register(
  CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
);

interface Props { data: ChartPoint[] }

export function ReportLineChart({ data }: Props) {
  const labels = data.map((d) =>
    new Date(d.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })
  );

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
        Grafik Penjualan Harian (30 Hari Terakhir)
      </h3>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
          Tidak ada data untuk ditampilkan
        </div>
      ) : (
        <Line
          data={{
            labels,
            datasets: [{
              label:           "Pendapatan",
              data:            data.map((d) => d.total),
              borderColor:     "#3b82f6",
              backgroundColor: "rgba(59,130,246,0.1)",
              borderWidth: 2, pointRadius: 3, tension: 0.4, fill: true,
            }],
          }}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              y: {
                ticks: {
                  callback: (v) => "Rp " + (Number(v) / 1000).toFixed(0) + "K",
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
  );
}