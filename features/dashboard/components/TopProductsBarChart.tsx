"use client";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Product { name: string; total_qty: number }
interface Props { data: Product[] }

export function TopProductsBarChart({ data }: Props) {
  return (
    <div className="card">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Produk Terlaris</h3>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Belum ada data</div>
      ) : (
        <Bar
          data={{
            labels: data.map((p) => p.name.length > 18 ? p.name.slice(0, 18) + "…" : p.name),
            datasets: [{
              label: "Terjual (unit)", data: data.map((p) => p.total_qty),
              backgroundColor: "rgba(16,185,129,0.8)", borderRadius: 4,
            }],
          }}
          options={{
            indexAxis: "y", responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              x: { ticks: { font: { size: 10 } }, grid: { color: "rgba(0,0,0,0.05)" } },
              y: { ticks: { font: { size: 10 } }, grid: { display: false } },
            },
          }}
        />
      )}
    </div>
  );
}