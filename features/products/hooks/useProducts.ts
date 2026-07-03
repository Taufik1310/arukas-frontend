"use client";
import { categoryApi, productApi, reportApi } from "@/lib/api";
import { Category, PaginationMeta, Product } from "@/types";
import { downloadBlob } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

export function useProducts() {
  const [products,   setProducts]   = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta,       setMeta]       = useState<PaginationMeta | null>(null);
  const [search,     setSearch]     = useState("");
  const [catFilter,  setCatFilter]  = useState("");
  const [page,       setPage]       = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [deleting,   setDeleting]   = useState<number | null>(null);
  const [scanning,   setScanning]   = useState(false);
  const [qrProduct,  setQrProduct]  = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await productApi.list({
        search:      search     || undefined,
        category_id: catFilter  || undefined,
        page, per_page: 10,
      });
      setProducts(data.data); setMeta(data.meta);
    } catch { toast.error("Gagal memuat produk"); }
    finally  { setLoading(false); }
  }, [search, catFilter, page]);

  useEffect(() => {
    void Promise.resolve().then(fetchProducts);
  }, [fetchProducts]);
  useEffect(() => { categoryApi.all().then((r) => setCategories(r.data.data)); }, []);

  const handleSearchChange = (v: string) => { setSearch(v); setPage(1); };
  const handleCatChange    = (v: string) => { setCatFilter(v); setPage(1); };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus produk "${name}"?`)) return;
    setDeleting(id);
    try { await productApi.delete(id); toast.success("Produk dihapus"); fetchProducts(); }
    catch { toast.error("Gagal menghapus produk"); }
    finally { setDeleting(null); }
  };

  const handleExport = async (type: "excel" | "pdf") => {
    try {
      const { data } = await reportApi.exportProducts({ type });
      downloadBlob(data, `data-produk.${type === "excel" ? "xlsx" : "pdf"}`);
      toast.success(`Export ${type.toUpperCase()} berhasil`);
    } catch { toast.error("Export gagal"); }
  };

  return {
    products, categories, meta, loading, deleting, scanning, qrProduct,
    search, catFilter,
    handleSearchChange, handleCatChange,
    setPage, handleDelete, handleExport,
    startScan:  () => setScanning(true),
    stopScan:   () => setScanning(false),
    setQrProduct,
  };
}