"use client";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { FiArrowRight } from "react-icons/fi";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { RegisterForm } from "../hooks/useRegisterStepper";

interface Props {
  form: RegisterForm;
  onUpdate: (key: keyof RegisterForm, value: string) => void;
  onNext: (e: React.FormEvent) => void;
}

export function RegisterStep1({ form, onUpdate, onNext }: Props) {
  return (
    <>
      <GoogleAuthButton label="Daftar dengan Google" />

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-slate-700" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white dark:bg-slate-900 px-4 text-xs text-gray-400 uppercase tracking-wider">
            atau isi form
          </span>
        </div>
      </div>

      <form onSubmit={onNext} className="space-y-4">
        <FormField
          label="Nama Lengkap" required autoComplete="name"
          value={form.name} placeholder="Masukkan nama lengkap"
          onChange={(e) => onUpdate("name", e.target.value)}
        />
        <FormField
          label="Alamat Email" type="email" required autoComplete="email"
          value={form.email} placeholder="email@contoh.com"
          onChange={(e) => onUpdate("email", e.target.value)}
        />
        <FormField
          label="No. Telepon" autoComplete="tel"
          value={form.phone} placeholder="08xxxxxxxxxx"
          hint="Opsional — untuk notifikasi WhatsApp"
          onChange={(e) => onUpdate("phone", e.target.value)}
        />
        <Button type="submit" fullWidth size="lg" className="py-3 bg-indigo-600 hover:bg-indigo-700"
          rightIcon={<FiArrowRight size={16} />}>
          Lanjutkan
        </Button>
      </form>
    </>
  );
}