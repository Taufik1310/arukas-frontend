"use client";
import MultiImageUpload from "@/components/MultiImageUpload";
import { categoryApi, productApi, supplierApi } from "@/lib/api";
import { Category, Product, Supplier } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type FormState = {
  name: string;
  description: string;
  category_id: string;
  purchase_price: string;
  sale_price: string;
  stock: string;
  min_stock: string;
  unit: string;
  barcode: string;
  is_active: boolean;
  supplier_ids: string[];
};

export default function ProductEditPage() {
  const router  = useRouter();
  const params  = useParams();
  const id      = Number(params.id);

  const [form,          setForm]          = useState<FormState | null>(null);
  const [newImages,     setNewImages]     = useState<File[]>([]);
  const [existingUrls,  setExistingUrls]  = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [categories,    setCategories]    = useState<Category[]>([]);
  const [suppliers,     setSuppliers]     = useState<Supplier[]>([]);
  const [saving,        setSaving]        = useState(false);
  const [loadingData,   setLoadingData]   = useState(true);

  useEffect(() => {
    Promise.all([
      productApi.get(id),
      categoryApi.all(),
      supplierApi.all(),
    ])
      .then(([p, c, s]) => {
        const product: Product = p.data.data;
        setForm({
          name:           product.name,
          description:    product.description ?? "",
          category_id:    String(product.category_id),
          purchase_price: String(product.purchase_price),
          sale_price:     String(product.sale_price),
          stock:          String(product.stock),
          min_stock:      String(product.min_stock),
          unit:           product.unit,
          barcode:        product.barcode ?? "",
          is_active:      product.is_active,
          supplier_ids:   product.suppliers.map((sup) => String(sup.id)),
        });
        setExistingUrls(product.image_urls);
        setCategories(c.data.data);
        setSuppliers(s.data.data);
      })
      .catch(() => {
        toast.error("Gagal memuat data produk");
        router.push("/products");
      })
      .finally(() => setLoadingData(false));
  }, [id, router]);

  const ch =
    (key: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) =>
      setForm((prev) => prev ? { ...prev, [key]: e.target.value } : prev);

  const toggleSupplier = (sid: string) => {
    if (!form) return;
    setForm({
      ...form,
      supplier_ids: form.supplier_ids.includes(sid)
        ? form.supplier_ids.filter((s) => s !== sid)
        : [...form.supplier_ids, sid],
    });
  };

  const handleRemoveExisting = (url: string) => {
    setExistingUrls((prev) => prev.filter((u) => u !== url));
    // Kirim path relatif untuk dihapus di backend
    const path = url.split("/storage/")[1];
    if (path) setRemovedImages((prev) => [...prev, path]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      const fd = new FormData();

      fd.append("name",           form.name);
      fd.append("description",    form.description);
      fd.append("category_id",    form.category_id);
      fd.append("purchase_price", form.purchase_price);
      fd.append("sale_price",     form.sale_price);
      fd.append("stock",          form.stock);
      fd.append("min_stock",      form.min_stock);
      fd.append("unit",           form.unit);
      fd.append("barcode",        form.barcode);
      fd.append("is_active",      form.is_active ? "1" : "0");

      form.supplier_ids.forEach((s) =>
        fd.append("supplier_ids[]", s)
      );
      newImages.forEach((img) => fd.append("images[]", img));
      removedImages.forEach((img) => fd.append("remove_images[]", img));

      await productApi.update(id, fd);
      toast.success("Produk berhasil diperbarui!");
      router.push("/products");
    } catch (err: unknown) {
      const errors = (
        err as { response?: { data?: { errors?: Record<string, string[]> } } }
      )?.response?.data?.errors;
      if (errors) {
        Object.values(errors).flat().forEach((m) => toast.error(m));
      } else {
        toast.error("Gagal memperbarui produk");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="max-w-3xl">
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Produk</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Perbarui data produk
          </p>
        </div>
        <a href="/products" className="btn-secondary btn-sm">
          ← Kembali
        </a>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Informasi Dasar */}
        <div className="card space-y-4">
          <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-slate-700 pb-2">
            Informasi Dasar
          </h3>
          <div>
            <label className="label">Nama Produk *</label>
            <input className="input" value={form.name} onChange={ch("name")} required />
          </div>
          <div>
            <label className="label">Deskripsi</label>
            <textarea className="input resize-none" rows={3} value={form.description} onChange={ch("description")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Kategori *</label>
              <select className="input" value={form.category_id} onChange={ch("category_id")} required>
                <option value="">-- Pilih Kategori --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Satuan</label>
              <input className="input" value={form.unit} onChange={ch("unit")} />
            </div>
          </div>
        </div>

        {/* Harga & Stok */}
        <div className="card space-y-4">
          <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-slate-700 pb-2">
            Harga & Stok
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Harga Beli (Rp) *</label>
              <input type="number" className="input" value={form.purchase_price} onChange={ch("purchase_price")} required min="0" />
            </div>
            <div>
              <label className="label">Harga Jual (Rp) *</label>
              <input type="number" className="input" value={form.sale_price} onChange={ch("sale_price")} required min="0" />
            </div>
            <div>
              <label className="label">Stok</label>
              <input type="number" className="input" value={form.stock} onChange={ch("stock")} min="0" />
            </div>
            <div>
              <label className="label">Min. Stok</label>
              <input type="number" className="input" value={form.min_stock} onChange={ch("min_stock")} min="0" />
            </div>
          </div>
          <div>
            <label className="label">Barcode</label>
            <input className="input" value={form.barcode} onChange={ch("barcode")} placeholder="Kosongkan jika tidak berubah" />
          </div>
        </div>

        {/* Supplier */}
        <div className="card space-y-3">
          <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-slate-700 pb-2">
            Supplier
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {suppliers.map((s) => {
              const checked = form.supplier_ids.includes(String(s.id));
              return (
                <label key={s.id}
                  className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                    checked
                      ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-slate-600 hover:border-gray-300"
                  }`}
                >
                  <input type="checkbox" className="mt-0.5 rounded"
                    checked={checked} onChange={() => toggleSupplier(String(s.id))} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.code}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Foto Produk */}
        <div className="card">
          <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-slate-700 pb-2 mb-3">
            Foto Produk
          </h3>
          <MultiImageUpload
            onChange={setNewImages}
            existingUrls={existingUrls}
            onRemoveExisting={handleRemoveExisting}
            maxFiles={5}
          />
        </div>

        {/* Status */}
        <div className="flex items-center gap-3 px-1">
          <input type="checkbox" id="is_active" checked={form.is_active}
            onChange={(e) => setForm((f) => f ? { ...f, is_active: e.target.checked } : f)}
            className="w-4 h-4 rounded" />
          <label htmlFor="is_active" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            Produk aktif (tampil di kasir POS)
          </label>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pb-6">
          <a href="/products" className="btn-secondary">Batal</a>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}