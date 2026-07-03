"use client";
import { FormField } from "@/components/molecules/FormField";
import { SupplierFormState } from "../hooks/useSuppliers";

interface Props {
  formId: string;
  form: SupplierFormState;
  onUpdate: (key: keyof SupplierFormState, value: string | boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function SupplierForm({ formId, form, onUpdate, onSubmit }: Props) {
  const ch = (key: keyof SupplierFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      onUpdate(key, e.target.value);

  return (
    <form id={formId} onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <FormField
          label="Nama Supplier" required
          value={form.name} onChange={ch("name")}
          placeholder="Nama perusahaan atau perorangan"
        />
      </div>
      <FormField
        label="Email" type="email"
        value={form.email} onChange={ch("email")}
        placeholder="email@supplier.com"
      />
      <FormField
        label="Telepon" required
        value={form.phone} onChange={ch("phone")}
        placeholder="08xxxxxxxxxx"
      />
      <FormField
        label="Kota"
        value={form.city} onChange={ch("city")}
        placeholder="Jakarta, Surabaya..."
      />
      <div>
        <label className="label">Status</label>
        <select
          className="input"
          value={form.is_active ? "1" : "0"}
          onChange={(e) => onUpdate("is_active", e.target.value === "1")}
        >
          <option value="1">Aktif</option>
          <option value="0">Nonaktif</option>
        </select>
      </div>
      <div className="col-span-2">
        <label className="label">Alamat</label>
        <textarea
          className="input resize-none" rows={2}
          value={form.address} onChange={ch("address")}
          placeholder="Alamat lengkap supplier"
        />
      </div>
      <div className="col-span-2">
        <label className="label">Catatan</label>
        <textarea
          className="input resize-none" rows={2}
          value={form.notes} onChange={ch("notes")}
          placeholder="Catatan tambahan (opsional)"
        />
      </div>
    </form>
  );
}