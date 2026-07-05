"use client";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import MultiImageUpload from "@/components/organisms/MultiImageUpload";
import { categoryApi, productApi, supplierApi } from "@/lib/api";
import { Category, Product, Supplier } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiSave } from "react-icons/fi";

interface Props { product?: Product }

type FormState = {
  name: string; description: string; category_id: string;
  purchase_price: string; sale_price: string; stock: string;
  min_stock: string; unit: string; barcode: string;
  is_active: boolean; supplier_ids: string[];
};

const INITIAL: FormState = {
  name: "", description: "", category_id: "",
  purchase_price: "", sale_price: "",
  stock: "0", min_stock: "5", unit: "pcs",
  barcode: "", is_active: true, supplier_ids: [],
};

const getInitialFormState = (product?: Product): FormState => product ? {
  name: product.name, description: product.description ?? "",
  category_id: String(product.category_id),
  purchase_price: String(product.purchase_price),
  sale_price: String(product.sale_price),
  stock: String(product.stock), min_stock: String(product.min_stock),
  unit: product.unit, barcode: product.barcode ?? "",
  is_active: product.is_active,
  supplier_ids: product.suppliers.map((s) => String(s.id)),
} : INITIAL;

export function ProductForm({ product }: Props) {
  const router = useRouter();
  const isEdit = !!product;

  const [form,          setForm]          = useState<FormState>(() => getInitialFormState(product));
  const [newImages,     setNewImages]     = useState<File[]>([]);
  const [existingUrls,  setExistingUrls]  = useState<string[]>(() => product?.image_urls ?? []);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [categories,    setCategories]    = useState<Category[]>([]);
  const [suppliers,     setSuppliers]     = useState<Supplier[]>([]);
  const [saving,        setSaving]        = useState(false);

  useEffect(() => {
    Promise.all([categoryApi.all(), supplierApi.all()])
      .then(([c, s]) => { setCategories(c.data.data); setSuppliers(s.data.data); });
  }, []);

  const ch = (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const toggleSupplier = (id: string) =>
    setForm((prev) => ({
      ...prev,
      supplier_ids: prev.supplier_ids.includes(id)
        ? prev.supplier_ids.filter((s) => s !== id)
        : [...prev.supplier_ids, id],
    }));

  const handleRemoveExisting = (url: string) => {
    setExistingUrls((prev) => prev.filter((u) => u !== url));
    const path = url.split("/storage/")[1];
    if (path) setRemovedImages((prev) => [...prev, path]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category_id) { toast.error("Pilih kategori produk"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name); fd.append("description", form.description);
      fd.append("category_id", form.category_id);
      fd.append("purchase_price", form.purchase_price); fd.append("sale_price", form.sale_price);
      fd.append("stock", form.stock); fd.append("min_stock", form.min_stock);
      fd.append("unit", form.unit); fd.append("barcode", form.barcode);
      fd.append("is_active", form.is_active ? "1" : "0");
      form.supplier_ids.forEach((id) => fd.append("supplier_ids[]", id));
      newImages.forEach((img) => fd.append("images[]", img));
      removedImages.forEach((img) => fd.append("remove_images[]", img));

      if (isEdit && product) {
        await productApi.update(product.id, fd);
        toast.success("Produk diperbarui!");
      } else {
        await productApi.store(fd);
        toast.success("Produk ditambahkan!");
      }
      router.push("/products");
    } catch (err: unknown) {
      const errors = (err as { response?: { data?: { errors?: Record<string,string[]> } } })?.response?.data?.errors;
      if (errors) Object.values(errors).flat().forEach((m) => toast.error(m));
      else toast.error("Gagal menyimpan produk");
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
      {/* Info Dasar */}
      <div className="card space-y-4">
        <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-slate-700 pb-2">Informasi Dasar</h3>
        <FormField label="Nama Produk" required value={form.name} onChange={ch("name")} placeholder="Nama produk" />
        <div>
          <label className="label">Deskripsi</label>
          <textarea className="input resize-none" rows={3} value={form.description} onChange={ch("description")} placeholder="Deskripsi singkat (opsional)" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Kategori <span className="text-red-500">*</span></label>
            <select className="input" value={form.category_id} onChange={ch("category_id")} required>
              <option value="">-- Pilih Kategori --</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <FormField label="Satuan" value={form.unit} onChange={ch("unit")} placeholder="pcs, kg, liter..." />
        </div>
      </div>

      {/* Harga & Stok */}
      <div className="card space-y-4">
        <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-slate-700 pb-2">Harga & Stok</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Harga Beli (Rp)" required type="number" min="0" value={form.purchase_price} onChange={ch("purchase_price")} />
          <FormField label="Harga Jual (Rp)" required type="number" min="0" value={form.sale_price} onChange={ch("sale_price")} />
          <FormField label="Stok" type="number" min="0" value={form.stock} onChange={ch("stock")} />
          <FormField label="Min. Stok" type="number" min="0" value={form.min_stock} onChange={ch("min_stock")} hint="Batas peringatan stok rendah" />
        </div>
        <FormField label="Barcode" value={form.barcode} onChange={ch("barcode")} placeholder="Kosongkan untuk auto-generate" />
      </div>

      {/* Supplier */}
      <div className="card space-y-3">
        <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-slate-700 pb-2">Supplier <span className="text-xs font-normal text-gray-400">(bisa lebih dari satu)</span></h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {suppliers.map((s) => {
            const checked = form.supplier_ids.includes(String(s.id));
            return (
              <label key={s.id} className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${checked ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-slate-600 hover:border-gray-300"}`}>
                <input type="checkbox" className="mt-0.5 rounded" checked={checked} onChange={() => toggleSupplier(String(s.id))} />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.code}</p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Foto */}
      <div className="card">
        <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-slate-700 pb-2 mb-3">Foto Produk</h3>
        <MultiImageUpload onChange={setNewImages} existingUrls={existingUrls} onRemoveExisting={handleRemoveExisting} maxFiles={5} />
      </div>

      {/* Status + Submit */}
      <div className="flex items-center gap-3 px-1">
        <input type="checkbox" id="is_active" className="w-4 h-4 rounded" checked={form.is_active}
          onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} />
        <label htmlFor="is_active" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
          Produk aktif (tampil di kasir POS)
        </label>
      </div>

      <div className="flex justify-end gap-3 pb-6">
        <Button type="button" variant="secondary" onClick={() => router.push("/products")}>Batal</Button>
        <Button type="submit" loading={saving} leftIcon={<FiSave size={15} />}>
          {isEdit ? "Simpan Perubahan" : "Simpan Produk"}
        </Button>
      </div>
    </form>
  );
}