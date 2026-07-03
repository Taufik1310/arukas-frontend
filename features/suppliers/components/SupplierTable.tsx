"use client";
import { Badge }             from "@/components/atoms/Badge";
import { Button }            from "@/components/atoms/Button";
import { DataTable, Column } from "@/components/organisms/DataTable";
import { PaginationMeta, Supplier } from "@/types";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

interface Props {
  data: Supplier[];
  loading: boolean;
  meta: PaginationMeta | null;
  onEdit: (s: Supplier) => void;
  onDelete: (id: number, name: string) => void;
  onPageChange: (page: number) => void;
}

export function SupplierTable({ data, loading, meta, onEdit, onDelete, onPageChange }: Props) {
  const columns: Column<Supplier>[] = [
    {
      key: "name", header: "Supplier",
      render: (s) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{s.name}</p>
          <p className="text-xs text-gray-400 font-mono">{s.code}</p>
        </div>
      ),
    },
    { key: "phone", header: "Telepon",   render: (s) => s.phone },
    { key: "city",  header: "Kota",      render: (s) => s.city ?? "-" },
    {
      key: "count", header: "Produk", align: "center",
      render: (s) => <Badge variant="blue">{s.products_count ?? 0}</Badge>,
    },
    {
      key: "status", header: "Status",
      render: (s) => (
        <Badge variant={s.is_active ? "green" : "gray"}>
          {s.is_active ? "Aktif" : "Nonaktif"}
        </Badge>
      ),
    },
    {
      key: "actions", header: "Aksi",
      render: (s) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="xs" leftIcon={<FiEdit2 size={13} />} onClick={() => onEdit(s)}>
            Edit
          </Button>
          <Button
            variant="ghost" size="xs" leftIcon={<FiTrash2 size={13} />}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={() => onDelete(s.id, s.name)}
          >
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns} data={data} keyExtractor={(s) => s.id}
      loading={loading} emptyMessage="Belum ada supplier."
      meta={meta} onPageChange={onPageChange}
    />
  );
}