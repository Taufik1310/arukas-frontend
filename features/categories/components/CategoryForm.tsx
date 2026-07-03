"use client";
import { FormField } from "@/components/molecules/FormField";
import { CategoryFormState } from "../hooks/useCategories";

interface Props {
  formId: string;
  form: CategoryFormState;
  onUpdate: (key: keyof CategoryFormState, value: string | boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CategoryForm({ formId, form, onUpdate, onSubmit }: Props) {
  return (
    <form id={formId} onSubmit={onSubmit} className="space-y-4">
      <FormField
        label="Nama Kategori" required
        value={form.name}
        onChange={(e) => onUpdate("name", e.target.value)}
        placeholder="Contoh: Makanan & Minuman"
      />
      <div>
        <label className="label">Deskripsi</label>
        <textarea
          className="input resize-none" rows={3}
          value={form.description}
          onChange={(e) => onUpdate("description", e.target.value)}
          placeholder="Deskripsi kategori (opsional)"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox" id="cat_is_active" className="w-4 h-4 rounded"
          checked={form.is_active}
          onChange={(e) => onUpdate("is_active", e.target.checked)}
        />
        <label htmlFor="cat_is_active" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
          Kategori aktif
        </label>
      </div>
    </form>
  );
}