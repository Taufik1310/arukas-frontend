"use client";
import { ReportFilter } from "../hooks/useReports";

interface Props {
  filter: ReportFilter;
  onUpdate: (key: keyof ReportFilter, value: string) => void;
}

export function ReportFilters({ filter, onUpdate }: Props) {
  const ch = (key: keyof ReportFilter) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      onUpdate(key, e.target.value);

  return (
    <div className="card">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Filter Laporan</p>
      <div className="flex flex-wrap gap-3">
        <div>
          <label className="label text-xs">Dari Tanggal</label>
          <input type="date" className="input text-sm" value={filter.start_date} onChange={ch("start_date")} />
        </div>
        <div>
          <label className="label text-xs">Sampai Tanggal</label>
          <input type="date" className="input text-sm" value={filter.end_date} onChange={ch("end_date")} />
        </div>
        <div>
          <label className="label text-xs">Status Pembayaran</label>
          <select className="input text-sm" value={filter.payment_status} onChange={ch("payment_status")}>
            <option value="">Semua Status</option>
            <option value="paid">Lunas</option>
            <option value="pending">Pending</option>
            <option value="failed">Gagal</option>
          </select>
        </div>
        <div>
          <label className="label text-xs">Metode Pembayaran</label>
          <select className="input text-sm" value={filter.payment_method} onChange={ch("payment_method")}>
            <option value="">Semua Metode</option>
            <option value="cash">Tunai</option>
            <option value="transfer">Transfer</option>
            <option value="midtrans">Online (Midtrans)</option>
          </select>
        </div>
      </div>
    </div>
  );
}