"use client";
import MultiImageUpload from "@/components/MultiImageUpload";
import { categoryApi, productApi, supplierApi } from "@/lib/api";
import { Category, Supplier } from "@/types";
import { useRouter } from "next/navigation";
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

const INITIAL: FormState = {
  name: "", description: "", category_id: "",
  purchase_price: "", sale_price: "",
  stock: "0", min_stock: "5", unit: "pcs",
  barcode: "", is_active: true, supplier_ids: [],
};

export default function ProductCreatePage() {
  const router = useRouter();
  const [form,       setForm]       = useState<FormState>(INITIAL);
  const [images,     setImages]     = useState<File[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers,  setSuppliers]  = useState<Supplier[]>([]);
  const [saving,     setSaving]     = useState(false);

  useEffect(() => {
    Promise.all([categoryApi.all(), supplierApi.all()]).then(([c, s]) => {
      setCategories(c.data.data);
      setSuppliers(s.data.data);
    });
  }, []);

  const ch =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const toggleSupplier = (id: string) => {
    setForm((prev) => ({
      ...prev,
      supplier_ids: prev.supplier_ids.includes(id)
        ? prev.supplier_ids.filter((s) => s !== id)
        : [...prev.supplier_ids, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category_id) {
      toast.error("Pilih kategori produk");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();

      // Append semua field teks
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

      // Append supplier IDs (many-to-many)
      form.supplier_ids.forEach((id) =>
        fd.append("supplier_ids[]", id)
      );

      // Append gambar
      images.forEach((img) => fd.append("images[]", img));

      await productApi.store(fd);
      toast.success("Produk berhasil ditambahkan!");
      router.push("/products");
    } catch (err: unknown) {
      const errors = (
        err as { response?: { data?: { errors?: Record<string, string[]> } } }
      )?.response?.data?.errors;
      if (errors) {
        Object.values(errors).flat().forEach((m) => toast.error(m));
      } else {
        toast.error("Gagal menyimpan produk");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tambah Produk</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Isi data produk baru
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
            <input
              className="input"
              value={form.name}
              onChange={ch("name")}
              required
              placeholder="Contoh: Indomie Goreng"
            />
          </div>
          <div>
            <label className="label">Deskripsi</label>
            <textarea
              className="input resize-none"
              rows={3}
              value={form.description}
              onChange={ch("description")}
              placeholder="Deskripsi singkat produk (opsional)"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Kategori *</label>
              <select
                className="input"
                value={form.category_id}
                onChange={ch("category_id")}
                required
              >
                <option value="">-- Pilih Kategori --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Satuan</label>
              <input
                className="input"
                value={form.unit}
                onChange={ch("unit")}
                placeholder="pcs, kg, liter, botol..."
              />
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
              <input
                type="number"
                className="input"
                value={form.purchase_price}
                onChange={ch("purchase_price")}
                required
                min="0"
                placeholder="0"
              />
            </div>
            <div>
              <label className="label">Harga Jual (Rp) *</label>
              <input
                type="number"
                className="input"
                value={form.sale_price}
                onChange={ch("sale_price")}
                required
                min="0"
                placeholder="0"
              />
            </div>
            <div>
              <label className="label">Stok Awal</label>
              <input
                type="number"
                className="input"
                value={form.stock}
                onChange={ch("stock")}
                min="0"
              />
            </div>
            <div>
              <label className="label">
                Min. Stok{" "}
                <span className="text-xs text-gray-400">(batas peringatan)</span>
              </label>
              <input
                type="number"
                className="input"
                value={form.min_stock}
                onChange={ch("min_stock")}
                min="0"
              />
            </div>
          </div>
          <div>
            <label className="label">
              Barcode{" "}
              <span className="text-xs text-gray-400">
                (kosongkan untuk auto-generate)
              </span>
            </label>
            <input
              className="input"
              value={form.barcode}
              onChange={ch("barcode")}
              placeholder="Scan atau ketik kode barcode"
            />
          </div>
        </div>

        {/* Supplier */}
        <div className="card space-y-3">
          <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-slate-700 pb-2">
            Supplier{" "}
            <span className="text-xs font-normal text-gray-400">
              (bisa lebih dari satu)
            </span>
          </h3>
          {suppliers.length === 0 ? (
            <p className="text-sm text-gray-400">
              Belum ada supplier.{" "}
              <a href="/suppliers" className="text-blue-600 hover:underline">
                Tambah supplier →
              </a>
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {suppliers.map((s) => {
                const checked = form.supplier_ids.includes(String(s.id));
                return (
                  <label
                    key={s.id}
                    className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                      checked
                        ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="mt-0.5 rounded"
                      checked={checked}
                      onChange={() => toggleSupplier(String(s.id))}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                        {s.name}
                      </p>
                      <p className="text-xs text-gray-400">{s.code}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Foto Produk */}
        <div className="card">
          <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-slate-700 pb-2 mb-3">
            Foto Produk
          </h3>
          <MultiImageUpload onChange={setImages} maxFiles={5} />
        </div>

        {/* Status */}
        <div className="flex items-center gap-3 px-1">
          <input
            type="checkbox"
            id="is_active"
            checked={form.is_active}
            onChange={(e) =>
              setForm((f) => ({ ...f, is_active: e.target.checked }))
            }
            className="w-4 h-4 rounded"
          />
          <label
            htmlFor="is_active"
            className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            Produk aktif (tampil di kasir POS)
          </label>
        </div>

        {/* Tombol Submit */}
        <div className="flex justify-end gap-3 pb-6">
          <a href="/products" className="btn-secondary">
            Batal
          </a>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Menyimpan...
              </span>
            ) : (
              "Simpan Produk"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}