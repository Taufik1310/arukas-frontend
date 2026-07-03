"use client";
import Image from "next/image";
import { SearchInput } from "@/components/molecules/SearchInput";
import { formatRupiah } from "@/lib/utils";
import { Product } from "@/types";
import { productApi } from "@/lib/api";
import { useEffect, useState } from "react";

interface Props { onAdd: (p: Product) => void }

export function ProductGrid({ onAdd }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [search,   setSearch]   = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      productApi.list({ search, per_page: 24, is_active: true })
        .then((r) => setProducts(r.data.data)).catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <SearchInput value={search} onChange={setSearch}
        placeholder="Cari produk atau ketik barcode..." className="mb-4 shrink-0" />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 overflow-y-auto flex-1 pb-4">
        {products.length === 0 && (
          <div className="col-span-full flex items-center justify-center h-48 text-gray-400 text-sm">
            {search ? "Produk tidak ditemukan" : "Memuat produk..."}
          </div>
        )}
        {products.map((p) => (
          <button key={p.id} onClick={() => onAdd(p)} disabled={p.stock <= 0}
            className={`card text-left transition-all ${
              p.stock > 0 ? "hover:border-blue-400 hover:shadow-md cursor-pointer" : "opacity-50 cursor-not-allowed"
            }`}>
            {p.image_urls[0]
              ? <Image src={p.image_urls[0]} alt={p.name} width={420} height={96}
                  className="w-full h-24 object-cover rounded-lg mb-2" />
              : <div className="w-full h-24 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-3xl mb-2">📦</div>
            }
            <p className="text-xs font-semibold line-clamp-2 leading-tight text-gray-900 dark:text-white">{p.name}</p>
            <p className="text-blue-600 dark:text-blue-400 font-bold text-sm mt-1">{formatRupiah(p.sale_price)}</p>
            <p className={`text-xs mt-0.5 ${p.is_low_stock ? "text-red-500 font-medium" : "text-gray-400"}`}>
              Stok: {p.stock} {p.unit}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}