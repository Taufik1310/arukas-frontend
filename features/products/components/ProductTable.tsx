"use client";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { DataTable, Column } from "@/components/organisms/DataTable";
import { formatRupiah } from "@/lib/utils";
import { PaginationMeta, Product } from "@/types";
import { FiEdit2, FiTrash2, FiMaximize2 } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

interface Props {
  products: Product[];
  loading: boolean;
  deleting: number | null;
  meta: PaginationMeta | null;
  onDelete: (id: number, name: string) => void;
  onQr: (product: Product) => void;
  onPageChange: (page: number) => void;
}

export function ProductTable({ products, loading, deleting, meta, onDelete, onQr, onPageChange }: Props) {
  const columns: Column<Product>[] = [
    {
      key: "product", header: "Produk",
      render: (p) => (
        <div className="flex items-center gap-3">
          {p.image_urls[0]
            ? (
              <Image
                src={p.image_urls[0]}
                alt={p.name}
                width={36}
                height={36}
                className="rounded-lg object-cover border border-gray-200 dark:border-slate-600 shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-sm shrink-0">📦</div>
            )
          }
          <div className="min-w-0">
            <p className="font-medium text-gray-900 dark:text-white text-sm truncate max-w-48">{p.name}</p>
            <p className="text-xs text-gray-400 font-mono">{p.code} · {p.unit}</p>
          </div>
        </div>
      ),
    },
    { key: "category", header: "Kategori", render: (p) => <span className="text-gray-500 dark:text-gray-400">{p.category?.name ?? "-"}</span> },
    { key: "price", header: "H. Jual", align: "right", render: (p) => <span className="font-medium">{formatRupiah(p.sale_price)}</span> },
    {
      key: "stock", header: "Stok", align: "right",
      render: (p) => (
        <div className="text-right">
          <span className={`font-semibold text-sm ${p.is_low_stock ? "text-red-500" : "text-gray-900 dark:text-white"}`}>{p.stock}</span>
          {p.is_low_stock && <span className="block text-xs text-red-400">⚠ rendah</span>}
        </div>
      ),
    },
    { key: "status", header: "Status", render: (p) => <Badge variant={p.is_active ? "green" : "gray"}>{p.is_active ? "Aktif" : "Nonaktif"}</Badge> },
    {
      key: "actions", header: "Aksi",
      render: (p) => (
        <div className="flex items-center gap-2">
          <Link href={`/products/${p.id}/edit`}>
            <Button variant="ghost" size="xs" leftIcon={<FiEdit2 size={13} />}>Edit</Button>
          </Link>
          <Button variant="ghost" size="xs" leftIcon={<FiMaximize2 size={13} />} onClick={() => onQr(p)}>QR</Button>
          <Button variant="ghost" size="xs" leftIcon={<FiTrash2 size={13} />}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            loading={deleting === p.id}
            onClick={() => onDelete(p.id, p.name)}>
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns} data={products} keyExtractor={(p) => p.id}
      loading={loading} emptyMessage="Belum ada produk"
      meta={meta} onPageChange={onPageChange}
    />
  );
}