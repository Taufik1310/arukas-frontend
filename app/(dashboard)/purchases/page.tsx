"use client";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";
import { productApi, purchaseApi, supplierApi } from "@/lib/api";
import { formatDate, formatRupiah } from "@/lib/utils";
import {
  PaginationMeta,
  Product,
  PurchaseTransaction,
  Supplier,
} from "@/types";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface PurchaseFormItem {
  product_id:   number;
  product_name: string;
  quantity:     number;
  unit_price:   number;
}

type FormState = {
  supplier_id: string;
  order_date:  string;
  notes:       string;
  items:       PurchaseFormItem[];
};

const STATUS_BADGE: Record<string, string> = {
  draft:     "badge-gray",
  ordered:   "badge-blue",
  received:  "badge-green",
  cancelled: "badge-red",
};

const STATUS_LABEL: Record<string, string> = {
  draft:     "Draft",
  ordered:   "Dipesan",
  received:  "Diterima",
  cancelled: "Dibatalkan",
};

export default function PurchasesPage() {
  const [data,          setData]          = useState<PurchaseTransaction[]>([]);
  const [meta,          setMeta]          = useState<PaginationMeta | null>(null);
  const [search,        setSearch]        = useState("");
  const [statusFilter,  setStatusFilter]  = useState("");
  const [page,          setPage]          = useState(1);
  const [loading,       setLoading]       = useState(true);
  const [modal,         setModal]         = useState(false);
  const [suppliers,     setSuppliers]     = useState<Supplier[]>([]);
  const [products,      setProducts]      = useState<Product[]>([]);
  const [productSearch, setPSearch]       = useState("");
  const [saving,        setSaving]        = useState(false);
  const [receiving,     setReceiving]     = useState<number | null>(null);

  const [form, setForm] = useState<FormState>({
    supplier_id: "",
    order_date:  new Date().toISOString().slice(0, 10),
    notes:       "",
    items:       [],
  });

  const total = form.items.reduce(
    (sum, i) => sum + i.quantity * i.unit_price,
    0
  );

  // Fetch daftar PO
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: r } = await purchaseApi.list({
        search: search || undefined,
        status: statusFilter || undefined,
        page,
      });
      setData(r.data);
      setMeta(r.meta);
    } catch {
      toast.error("Gagal memuat data pembelian");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchData]);

  // Ambil semua supplier saat komponen mount
  useEffect(() => {
    supplierApi.all()
      .then((r) => setSuppliers(r.data.data))
      .catch(() => {});
  }, []);

  // Cari produk dengan debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!productSearch.trim()) {
        setProducts([]);
        return;
      }
      productApi
        .list({ search: productSearch, per_page: 8 })
        .then((r) => setProducts(r.data.data))
        .catch(() => {});
    }, 300);
    return () => clearTimeout(timer);
  }, [productSearch]);

  // Tambah produk ke daftar item PO
  const addItem = (p: Product) => {
    if (form.items.find((i) => i.product_id === p.id)) {
      toast("Produk sudah ada di daftar");
      return;
    }
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          product_id:   p.id,
          product_name: p.name,
          quantity:     1,
          unit_price:   p.purchase_price,
        },
      ],
    }));
    setPSearch("");
    setProducts([]);
  };

  // Update qty atau harga item
  const updateItem = (
    idx: number,
    field: "quantity" | "unit_price",
    val: number
  ) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === idx ? { ...item, [field]: val } : item
      ),
    }));
  };

  // Hapus item dari daftar
  const removeItem = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));
  };

  // Reset form
  const resetForm = () => {
    setForm({
      supplier_id: "",
      order_date:  new Date().toISOString().slice(0, 10),
      notes:       "",
      items:       [],
    });
    setPSearch("");
    setProducts([]);
  };

  // Submit buat PO baru
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.supplier_id) {
      toast.error("Pilih supplier terlebih dahulu");
      return;
    }
    if (form.items.length === 0) {
      toast.error("Tambahkan minimal 1 produk");
      return;
    }
    setSaving(true);
    try {
      await purchaseApi.store({
        supplier_id: Number(form.supplier_id),
        order_date:  form.order_date,
        notes:       form.notes,
        items: form.items.map((i) => ({
          product_id: i.product_id,
          quantity:   i.quantity,
          unit_price: i.unit_price,
        })),
      });
      toast.success("Purchase Order berhasil dibuat");
      setModal(false);
      resetForm();
      fetchData();
    } catch (err: unknown) {
      toast.error(
        (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ?? "Gagal membuat PO"
      );
    } finally {
      setSaving(false);
    }
  };

  // Tandai PO sebagai diterima → stok bertambah otomatis
  const handleReceive = async (id: number, code: string) => {
    if (
      !confirm(
        `Tandai PO ${code} sebagai "Diterima"?\n\nStok semua produk dalam PO ini akan diperbarui secara otomatis.`
      )
    )
      return;

    setReceiving(id);
    try {
      await purchaseApi.receive(id);
      toast.success("Pembelian diterima! Stok produk telah diperbarui.");
      fetchData();
    } catch (err: unknown) {
      toast.error(
        (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ?? "Gagal menerima pembelian"
      );
    } finally {
      setReceiving(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Transaksi Pembelian</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Kelola purchase order dan penerimaan barang
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setModal(true); }}
          className="btn-primary"
        >
          + Buat Purchase Order
        </button>
      </div>

      {/* Tabel */}
      <div className="card">
        {/* Filter */}
        <div className="flex flex-wrap gap-3 mb-5">
          <input
            className="input flex-1 min-w-48"
            placeholder="Cari kode PO..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <select
            className="input w-44"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">Semua Status</option>
            <option value="draft">Draft</option>
            <option value="ordered">Dipesan</option>
            <option value="received">Diterima</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="th">Kode PO</th>
                <th className="th">Supplier</th>
                <th className="th text-right">Total</th>
                <th className="th">Status</th>
                <th className="th">Tgl Order</th>
                <th className="th">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                      Memuat...
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-400 text-sm">
                    {search || statusFilter
                      ? "Tidak ada PO yang sesuai filter"
                      : "Belum ada purchase order."}
                  </td>
                </tr>
              ) : (
                data.map((p) => (
                  <tr key={p.id} className="tr">
                    <td className="td">
                      <span className="font-mono font-semibold text-xs text-gray-900 dark:text-white">
                        {p.code}
                      </span>
                    </td>
                    <td className="td">
                      <p className="font-medium text-sm text-gray-900 dark:text-white">
                        {p.supplier?.name ?? "-"}
                      </p>
                    </td>
                    <td className="td text-right font-medium text-gray-900 dark:text-white">
                      {formatRupiah(p.total_amount)}
                    </td>
                    <td className="td">
                      <span className={STATUS_BADGE[p.status] ?? "badge-gray"}>
                        {STATUS_LABEL[p.status] ?? p.status}
                      </span>
                    </td>
                    <td className="td text-xs text-gray-400">
                      {formatDate(p.order_date)}
                    </td>
                    <td className="td">
                      {p.status === "ordered" && (
                        <button
                          onClick={() => handleReceive(p.id, p.code)}
                          disabled={receiving === p.id}
                          className="btn-success btn-sm disabled:opacity-60"
                        >
                          {receiving === p.id ? "..." : "✓ Terima Barang"}
                        </button>
                      )}
                      {p.status === "received" && (
                        <span className="text-xs text-gray-400">
                          Diterima {formatDate(p.received_date ?? "")}
                        </span>
                      )}
                      {p.status === "draft" && (
                        <span className="text-xs text-gray-400">
                          Belum dikirim
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {meta && (
          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            total={meta.total}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Modal Buat PO */}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Buat Purchase Order"
        size="xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setModal(false)}
              className="btn-secondary"
            >
              Batal
            </button>
            <button
              form="po-form"
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving ? "Menyimpan..." : "Buat PO"}
            </button>
          </>
        }
      >
        <form id="po-form" onSubmit={handleSubmit} className="space-y-5">

          {/* Info PO */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Supplier *</label>
              <select
                className="input"
                value={form.supplier_id}
                onChange={(e) =>
                  setForm((f) => ({ ...f, supplier_id: e.target.value }))
                }
                required
              >
                <option value="">-- Pilih Supplier --</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Tanggal Order</label>
              <input
                type="date"
                className="input"
                value={form.order_date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, order_date: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Cari & Tambah Produk */}
          <div>
            <label className="label">Cari Produk</label>
            <div className="relative">
              <input
                className="input"
                placeholder="Ketik nama produk..."
                value={productSearch}
                onChange={(e) => setPSearch(e.target.value)}
                autoComplete="off"
              />
              {products.length > 0 && (
                <div className="absolute z-10 w-full top-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-lg overflow-hidden">
                  {products.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => addItem(p)}
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 text-left border-b border-gray-100 dark:border-slate-700 last:border-0 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {p.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {p.code} · Stok: {p.stock} {p.unit}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400 ml-4 shrink-0">
                        {formatRupiah(p.purchase_price)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tabel Item PO */}
          {form.items.length > 0 ? (
            <div className="border border-gray-200 dark:border-slate-600 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-700">
                    <th className="th py-2 pl-4">Produk</th>
                    <th className="th py-2 text-right">Qty</th>
                    <th className="th py-2 text-right">Harga/unit (Rp)</th>
                    <th className="th py-2 text-right">Subtotal</th>
                    <th className="th py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {form.items.map((item, i) => (
                    <tr
                      key={i}
                      className="border-t border-gray-100 dark:border-slate-700"
                    >
                      <td className="py-2 pl-4 pr-3 text-sm text-gray-900 dark:text-white">
                        {item.product_name}
                      </td>
                      <td className="py-2 pr-3">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(i, "quantity", Number(e.target.value))
                          }
                          className="input w-20 text-right text-sm py-1"
                        />
                      </td>
                      <td className="py-2 pr-3">
                        <input
                          type="number"
                          min="0"
                          value={item.unit_price}
                          onChange={(e) =>
                            updateItem(i, "unit_price", Number(e.target.value))
                          }
                          className="input w-36 text-right text-sm py-1"
                        />
                      </td>
                      <td className="py-2 pr-3 text-right text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        {formatRupiah(item.quantity * item.unit_price)}
                      </td>
                      <td className="py-2 pr-3">
                        <button
                          type="button"
                          onClick={() => removeItem(i)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                          title="Hapus item"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700">
                    <td
                      colSpan={3}
                      className="py-3 pl-4 text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Total ({form.items.length} item)
                    </td>
                    <td className="py-3 pr-3 text-right text-sm font-bold text-blue-600 dark:text-blue-400">
                      {formatRupiah(total)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-200 dark:border-slate-600 rounded-xl py-8 text-center">
              <p className="text-sm text-gray-400">
                Belum ada produk. Cari produk di atas untuk menambahkan.
              </p>
            </div>
          )}

          {/* Catatan */}
          <div>
            <label className="label">Catatan</label>
            <textarea
              className="input resize-none"
              rows={2}
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
              placeholder="Catatan tambahan untuk PO ini (opsional)"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}