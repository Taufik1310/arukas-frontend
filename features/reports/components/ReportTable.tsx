"use client";
import { Badge }             from "@/components/atoms/Badge";
import { DataTable, Column } from "@/components/organisms/DataTable";
import { formatDate, formatRupiah } from "@/lib/utils";
import { PaginationMeta, SaleTransaction } from "@/types";

type BadgeVariant = "green" | "blue" | "red" | "amber" | "gray" | "purple";

const STATUS_BADGE:  Record<string, BadgeVariant> = { paid: "green", pending: "amber", failed: "red" };
const METHOD_BADGE:  Record<string, BadgeVariant> = { cash: "gray", transfer: "blue", midtrans: "purple" };

interface Props {
  data: SaleTransaction[];
  loading: boolean;
  meta: PaginationMeta | null;
  onPageChange: (page: number) => void;
}

export function ReportTable({ data, loading, meta, onPageChange }: Props) {
  const columns: Column<SaleTransaction>[] = [
    {
      key: "code", header: "Kode",
      render: (s) => (
        <span className="font-mono text-xs font-semibold text-gray-900 dark:text-white">
          {s.code}
        </span>
      ),
    },
    {
      key: "user", header: "Kasir",
      render: (s) => s.user?.name ?? "-",
    },
    {
      key: "customer", header: "Pelanggan",
      render: (s) => s.customer_name ?? <span className="text-gray-400 italic text-xs">Umum</span>,
    },
    {
      key: "total", header: "Total", align: "right",
      render: (s) => (
        <span className="font-semibold">{formatRupiah(s.total_amount)}</span>
      ),
    },
    {
      key: "method", header: "Metode",
      render: (s) => (
        <Badge variant={METHOD_BADGE[s.payment_method] ?? "gray"}>
          {s.payment_method}
        </Badge>
      ),
    },
    {
      key: "status", header: "Status",
      render: (s) => (
        <Badge variant={STATUS_BADGE[s.payment_status] ?? "gray"}>
          {s.payment_status}
        </Badge>
      ),
    },
    {
      key: "date", header: "Tanggal",
      render: (s) => (
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {formatDate(s.created_at, true)}
        </span>
      ),
    },
  ];

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Detail Transaksi</h3>
      <DataTable
        columns={columns} data={data} keyExtractor={(s) => s.id}
        loading={loading} emptyMessage="Tidak ada transaksi pada periode ini"
        meta={meta} onPageChange={onPageChange}
      />
    </div>
  );
}