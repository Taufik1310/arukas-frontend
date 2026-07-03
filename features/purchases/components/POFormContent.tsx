"use client";
import { Button }    from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { formatRupiah } from "@/lib/utils";
import { POFormState, POItem } from "../hooks/usePurchases";
import { Product, Supplier }   from "@/types";
import { FiX } from "react-icons/fi";

interface Props {
  formId: string;
  form: POFormState;
  total: number;
  suppliers: Supplier[];
  productSearch: string;
  searchResults: Product[];
  onFormFieldUpdate: (key: keyof Omit<POFormState, "items">, value: string) => void;
  onProductSearchChange: (v: string) => void;
  onAddItem: (p: Product) => void;
  onUpdateItem: (idx: number, field: "quantity" | "unit_price", val: number) => void;
  onRemoveItem: (idx: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function POFormContent({
  formId, form, total, suppliers,
  productSearch, searchResults,
  onFormFieldUpdate, onProductSearchChange,
  onAddItem, onUpdateItem, onRemoveItem,
  onSubmit,
}: Props) {
  return (
    <form id={formId} onSubmit={onSubmit} className="space-y-5">
      {/* Header PO */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Supplier <span className="text-red-500">*</span></label>
          <select
            className="input"
            value={form.supplier_id}
            onChange={(e) => onFormFieldUpdate("supplier_id", e.target.value)}
            required
          >
            <option value="">-- Pilih Supplier --</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <FormField
          label="Tanggal Order" type="date"
          value={form.order_date}
          onChange={(e) => onFormFieldUpdate("order_date", e.target.value)}
        />
      </div>

      {/* Cari Produk */}
      <div>
        <label className="label">Cari Produk</label>
        <div className="relative">
          <input
            className="input"
            placeholder="Ketik nama produk..."
            value={productSearch}
            onChange={(e) => onProductSearchChange(e.target.value)}
            autoComplete="off"
          />
          {searchResults.length > 0 && (
            <div className="absolute z-10 w-full top-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-lg overflow-hidden">
              {searchResults.map((p) => (
                <Button
                  key={p.id} type="button"
                  onClick={() => onAddItem(p)}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 text-left border-b border-gray-100 dark:border-slate-700 last:border-0 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.code} · Stok: {p.stock} {p.unit}</p>
                  </div>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400 ml-4 shrink-0">
                    {formatRupiah(p.purchase_price)}
                  </span>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Daftar Item */}
      {form.items.length > 0 ? (
        <div className="border border-gray-200 dark:border-slate-600 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-700 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="text-left px-4 py-2.5">Produk</th>
                <th className="text-right px-3 py-2.5 w-24">Qty</th>
                <th className="text-right px-3 py-2.5 w-36">Harga/unit</th>
                <th className="text-right px-3 py-2.5 w-32">Subtotal</th>
                <th className="px-3 py-2.5 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {form.items.map((item: POItem, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-slate-700">
                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{item.product_name}</td>
                  <td className="px-3 py-2">
                    <input
                      type="number" min="1" value={item.quantity}
                      onChange={(e) => onUpdateItem(i, "quantity", Number(e.target.value))}
                      className="input w-full text-right text-sm py-1"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number" min="0" value={item.unit_price}
                      onChange={(e) => onUpdateItem(i, "unit_price", Number(e.target.value))}
                      className="input w-full text-right text-sm py-1"
                    />
                  </td>
                  <td className="px-3 py-2 text-right text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    {formatRupiah(item.quantity * item.unit_price)}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      type="button" onClick={() => onRemoveItem(i)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <FiX size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700">
                <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                  Total ({form.items.length} item)
                </td>
                <td className="px-3 py-3 text-right text-sm font-bold text-blue-600 dark:text-blue-400">
                  {formatRupiah(total)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-200 dark:border-slate-600 rounded-xl py-8 text-center">
          <p className="text-sm text-gray-400">Cari dan pilih produk di atas untuk menambahkan ke PO</p>
        </div>
      )}

      {/* Catatan */}
      <div>
        <label className="label">Catatan</label>
        <textarea
          className="input resize-none" rows={2}
          value={form.notes}
          onChange={(e) => onFormFieldUpdate("notes", e.target.value)}
          placeholder="Catatan tambahan (opsional)"
        />
      </div>
    </form>
  );
}