"use client";
import { Badge }              from "@/components/atoms/Badge";
import { Button }             from "@/components/atoms/Button";
import { DataTable, Column }  from "@/components/organisms/DataTable";
import { Category, PaginationMeta } from "@/types";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

interface Props {
  data: Category[];
  loading: boolean;
  meta: PaginationMeta | null;
  onEdit: (c: Category) => void;
  onDelete: (id: number, name: string) => void;
  onPageChange: (page: number) => void;
}

export function CategoryTable({ data, loading, meta, onEdit, onDelete, onPageChange }: Props) {
  const columns: Column<Category>[] = [
    {
      key: "name", header: "Nama",
      render: (c) => (
        <span className="font-medium text-gray-900 dark:text-white">{c.name}</span>
      ),
    },
    {
      key: "slug", header: "Slug",
      render: (c) => (
        <code className="text-xs bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded text-gray-500 dark:text-gray-400">
          {c.slug}
        </code>
      ),
    },
    {
      key: "count", header: "Produk", align: "center",
      render: (c) => <Badge variant="blue">{c.products_count ?? 0} produk</Badge>,
    },
    {
      key: "status", header: "Status",
      render: (c) => (
        <Badge variant={c.is_active ? "green" : "gray"}>
          {c.is_active ? "Aktif" : "Nonaktif"}
        </Badge>
      ),
    },
    {
      key: "actions", header: "Aksi",
      render: (c) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="xs" leftIcon={<FiEdit2 size={13} />} onClick={() => onEdit(c)}>
            Edit
          </Button>
          <Button
            variant="ghost" size="xs" leftIcon={<FiTrash2 size={13} />}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={() => onDelete(c.id, c.name)}
          >
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns} data={data} keyExtractor={(c) => c.id}
      loading={loading} emptyMessage="Belum ada kategori."
      meta={meta} onPageChange={onPageChange}
    />
  );
}