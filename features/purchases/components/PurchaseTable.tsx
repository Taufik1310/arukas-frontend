"use client";
import { Badge }             from "@/components/atoms/Badge";
import { Button }            from "@/components/atoms/Button";
import { DataTable, Column } from "@/components/organisms/DataTable";
import { formatDate, formatRupiah } from "@/lib/utils";
import { PaginationMeta, PurchaseTransaction } from "@/types";
import { FiCheckCircle }     from "react-icons/fi";

type BadgeVariant = "green" | "blue" | "red" | "amber" | "gray";

const STATUS_BADGE: Record<string, BadgeVariant> = {
  draft: "gray", ordered: "blue", received: "green", cancelled: "red",
};

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft", ordered: "Dipesan", received: "Diterima", cancelled: "Dibatalkan",
};

interface Props {
  data: PurchaseTransaction[];
  loading: boolean;
  receiving: number | null;
  meta: PaginationMeta | null;
  onReceive: (id: number, code: string) => void;
  onPageChange: (page: number) => void;
}

export function PurchaseTable({ data, loading, receiving, meta, onReceive, onPageChange }: Props) {
  const columns: Column<PurchaseTransaction>[] = [
    {
      key: "code", header: "Kode PO",
      render: (p) => (
        <span className="font-mono font-semibold text-xs text-gray-900 dark:text-white">
          {p.code}
        </span>
      ),
    },
    {
      key: "supplier", header: "Supplier",
      render: (p) => (
        <span className="font-medium text-sm">{p.supplier?.name ?? "-"}</span>
      ),
    },
    {
      key: "total", header: "Total", align: "right",
      render: (p) => (
        <span className="font-semibold">{formatRupiah(p.total_amount)}</span>
      ),
    },
    {
      key: "status", header: "Status",
      render: (p) => (
        <Badge variant={STATUS_BADGE[p.status] ?? "gray"}>
          {STATUS_LABEL[p.status] ?? p.status}
        </Badge>
      ),
    },
    {
      key: "date", header: "Tgl Order",
      render: (p) => (
        <span className="text-xs text-gray-400">{formatDate(p.order_date)}</span>
      ),
    },
    {
      key: "actions", header: "Aksi",
      render: (p) => {
        if (p.status === "ordered") {
          return (
            <Button
              variant="success" size="xs"
              leftIcon={<FiCheckCircle size={13} />}
              loading={receiving === p.id}
              onClick={() => onReceive(p.id, p.code)}
            >
              Terima Barang
            </Button>
          );
        }
        if (p.status === "received") {
          return (
            <span className="text-xs text-gray-400">
              Diterima {formatDate(p.received_date ?? "")}
            </span>
          );
        }
        return <span className="text-xs text-gray-400">-</span>;
      },
    },
  ];

  return (
    <DataTable
      columns={columns} data={data} keyExtractor={(p) => p.id}
      loading={loading} emptyMessage="Belum ada purchase order."
      meta={meta} onPageChange={onPageChange}
    />
  );
}