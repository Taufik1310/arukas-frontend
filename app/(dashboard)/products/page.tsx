"use client";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import { categoryApi, productApi, reportApi } from "@/lib/api";
import { downloadBlob, formatRupiah } from "@/lib/utils";
import { Category, PaginationMeta, Product } from "@/types";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

// Import BarcodeScanner secara dinamis karena butuh browser API
const BarcodeScanner = dynamic(
  () => import("@/components/BarcodeScanner"),
  { ssr: false }
);

export default function ProductsPage() {
  const [products,   setProducts]   = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta,       setMeta]       = useState<PaginationMeta | null>(null);
  const [search,     setSearch]     = useState("");
  const [catFilter,  setCatFilter]  = useState("");
  const [page,       setPage]       = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [scanning,   setScanning]   = useState(false);
  const [qrProduct,  setQrProduct]  = useState<Product | null>(null);
  const [deleting,   setDeleting]   = useState<number | null>(null);

  // Fetch produk setiap kali filter/halaman berubah
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await productApi.list({
        search:      search || undefined,
        category_id: catFilter || undefined,
        page,
        per_page: 10,
      });
      setProducts(data.data);
      setMeta(data.meta);
    } catch {
      toast.error("Gagal memuat produk");
    } finally {
      setLoading(false);
    }
  }, [search, catFilter, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  // Ambil semua kategori untuk dropdown filter
  useEffect(() => {
    categoryApi.all()
      .then((r) => setCategories(r.data.data))
      .catch(() => {});
  }, []);

  // Hapus produk
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Yakin ingin menghapus produk "${name}"?`)) return;
    setDeleting(id);
    try {
      await productApi.delete(id);
      toast.success("Produk berhasil dihapus");
      fetchProducts();
    } catch {
      toast.error("Gagal menghapus produk");
    } finally {
      setDeleting(null);
    }
  };

  // Export file
  const handleExport = async (type: "excel" | "pdf") => {
    try {
      const { data } = await reportApi.exportProducts({ type });
      downloadBlob(
        data,
        `data-produk.${type === "excel" ? "xlsx" : "pdf"}`
      );
      toast.success(`Export ${type.toUpperCase()} berhasil`);
    } catch {
      toast.error("Export gagal");
    }
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Data Produk</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Kelola semua produk toko
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleExport("excel")}
            className="btn-outline btn-sm"
          >
            ⬇ Excel
          </button>
          <button
            onClick={() => handleExport("pdf")}
            className="btn-outline btn-sm"
          >
            ⬇ PDF
          </button>
          <button
            onClick={() => setScanning(true)}
            className="btn-secondary btn-sm"
          >
            📷 Scan Barcode
          </button>
          <a href="/products/create" className="btn-primary btn-sm">
            + Tambah Produk
          </a>
        </div>
      </div>

      {/* Tabel */}
      <div className="card">
        {/* Filter */}
        <div className="flex flex-wrap gap-3 mb-5">
          <input
            className="input flex-1 min-w-48"
            placeholder="Cari nama, kode, atau barcode..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <select
            className="input w-48"
            value={catFilter}
            onChange={(e) => {
              setCatFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="th">Produk</th>
                <th className="th">Kategori</th>
                <th className="th text-right">H. Jual</th>
                <th className="th text-right">Stok</th>
                <th className="th">Status</th>
                <th className="th">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                      Memuat data...
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-400 text-sm">
                    {search || catFilter
                      ? "Tidak ada produk yang sesuai filter"
                      : "Belum ada produk. Klik '+ Tambah Produk' untuk mulai."}
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="tr">
                    {/* Nama produk */}
                    <td className="td">
                      <div className="flex items-center gap-3">
                        {p.image_urls[0] ? (
                          <Image
                            src={p.image_urls[0]}
                            alt={p.name}
                            width={36}
                            height={36}
                            className="w-9 h-9 rounded-lg object-cover border border-gray-200 dark:border-slate-600 shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-gray-101 dark:bg-slate-700 flex items-center justify-center text-sm shrink-0">
                            📦
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white text-sm truncate max-w-48">
                            {p.name}
                          </p>
                          <p className="text-xs text-gray-400 font-mono">
                            {p.code} · {p.unit}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Kategori */}
                    <td className="td text-gray-500 dark:text-gray-400">
                      {p.category?.name ?? "-"}
                    </td>

                    {/* Harga jual */}
                    <td className="td text-right font-medium text-gray-900 dark:text-white">
                      {formatRupiah(p.sale_price)}
                    </td>

                    {/* Stok */}
                    <td className="td text-right">
                      <span
                        className={`font-semibold text-sm ${
                          p.is_low_stock
                            ? "text-red-500"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {p.stock}
                      </span>
                      {p.is_low_stock && (
                        <span className="block text-xs text-red-400">
                          ⚠ rendah
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="td">
                      <span className={p.is_active ? "badge-green" : "badge-gray"}>
                        {p.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="td">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/products/${p.id}/edit`}
                          className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 text-xs font-medium hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setQrProduct(p)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs"
                          title="Lihat QR Code"
                        >
                          QR
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          disabled={deleting === p.id}
                          className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-50"
                        >
                          {deleting === p.id ? "..." : "Hapus"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && (
          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            total={meta.total}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Modal Barcode Scanner */}
      {scanning && (
        <BarcodeScanner
          onScan={(code) => {
            setSearch(code);
            setPage(1);
            setScanning(false);
            toast.success(`Barcode terdeteksi: ${code}`);
          }}
          onClose={() => setScanning(false)}
        />
      )}

      {/* Modal QR Code */}
      <Modal
        open={!!qrProduct}
        onClose={() => setQrProduct(null)}
        title="QR Code Produk"
        size="sm"
      >
        {qrProduct && (
          <QRCodeDisplay
            value={qrProduct.code}
            productName={qrProduct.name}
          />
        )}
      </Modal>
    </div>
  );
}