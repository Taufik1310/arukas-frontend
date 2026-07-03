"use client";
import { FormField }      from "@/components/molecules/FormField";
import { PasswordField }  from "@/components/molecules/PasswordField";
import { UserFormState }  from "../hooks/useUsers";

interface Props {
  formId:   string;
  form:     UserFormState;
  isEdit:   boolean;
  onUpdate: (key: keyof UserFormState, value: string | boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function UserForm({ formId, form, isEdit, onUpdate, onSubmit }: Props) {
  const ch = (key: keyof UserFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      onUpdate(key, e.target.value);

  return (
    <form id={formId} onSubmit={onSubmit} className="space-y-4">
      <FormField
        label="Nama Lengkap" required
        value={form.name} onChange={ch("name")}
        placeholder="Nama lengkap user"
      />
      <FormField
        label="Email" type="email" required
        value={form.email} onChange={ch("email")}
        placeholder="email@contoh.com"
      />
      <FormField
        label="No. Telepon"
        value={form.phone} onChange={ch("phone")}
        placeholder="08xxxxxxxxxx"
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Role <span className="text-red-500">*</span></label>
          <select className="input" value={form.role} onChange={ch("role")}>
            <option value="petugas">Petugas</option>
            <option value="admin">Admin</option>
          </select>
        </div>
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
      </div>

      {/* Password section */}
      <div className="border-t border-gray-200 dark:border-slate-700 pt-4 space-y-3">
        <p className="text-xs text-gray-400">
          {isEdit
            ? "Kosongkan password jika tidak ingin mengubahnya."
            : "Password wajib diisi untuk user baru."}
        </p>
        <PasswordField
          label={isEdit ? "Password Baru" : "Password"}
          required={!isEdit}
          value={form.password}
          onChange={ch("password")}
          placeholder="Min. 8 karakter"
          minLength={isEdit ? undefined : 8}
          autoComplete="new-password"
        />
        <PasswordField
          label="Konfirmasi Password"
          required={!isEdit}
          value={form.password_confirmation}
          onChange={ch("password_confirmation")}
          placeholder="Ulangi password"
          autoComplete="new-password"
          error={
            form.password_confirmation &&
            form.password !== form.password_confirmation
              ? "Password tidak sama"
              : undefined
          }
        />
      </div>
    </form>
  );
}