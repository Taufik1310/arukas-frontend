"use client";
import { Button } from "@/components/atoms/Button";
import { PasswordField } from "@/components/molecules/PasswordField";
import { FiArrowLeft } from "react-icons/fi";
import { PasswordStrength } from "./PasswordStrength";
import { RegisterForm } from "../hooks/useRegisterStepper";

interface Props {
  form: RegisterForm;
  onUpdate: (key: keyof RegisterForm, value: string) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
}

export function RegisterStep2({ form, onUpdate, onBack, onSubmit, submitting }: Props) {
  const mismatch = !!form.password_confirmation &&
    form.password !== form.password_confirmation;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Ringkasan step 1 */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl p-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{form.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{form.email}</p>
        </div>
        <button type="button" onClick={onBack}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
          Ubah
        </button>
      </div>

      <div>
        <PasswordField
          label="Buat Password" required minLength={8}
          value={form.password} placeholder="Minimal 8 karakter"
          autoComplete="new-password"
          onChange={(e) => onUpdate("password", e.target.value)}
        />
        <PasswordStrength password={form.password} />
      </div>

      <PasswordField
        label="Konfirmasi Password" required
        value={form.password_confirmation}
        placeholder="Ulangi password" autoComplete="new-password"
        error={mismatch ? "Password tidak sama" : undefined}
        onChange={(e) => onUpdate("password_confirmation", e.target.value)}
      />

      <div className="flex gap-3 pt-1">
        <Button type="button" variant="outline" fullWidth size="lg" className="py-3 border-2"
          leftIcon={<FiArrowLeft size={16} />} onClick={onBack}>
          Kembali
        </Button>
        <Button type="submit" fullWidth size="lg" loading={submitting}
          className="py-3 bg-indigo-600 hover:bg-indigo-700">
          Buat Akun
        </Button>
      </div>
    </form>
  );
}