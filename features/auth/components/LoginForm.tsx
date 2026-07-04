"use client";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { PasswordField } from "@/components/molecules/PasswordField";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GoogleAuthButton } from "./GoogleAuthButton";

export function LoginForm() {
  const { login, user, isLoading } = useAuth();
  const router = useRouter();
  const [form, setForm]      = useState({ email: "admin@arukas.com", password: "admin123" });
  const [submitting, setSub] = useState(false);

  useEffect(() => {
    if (!isLoading && user) router.replace("/dashboard");
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSub(true);
    try {
      await login(form.email, form.password);
    } catch (err: unknown) {
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
          ?? "Email atau password salah."
      );
    } finally { setSub(false); }
  };

  if (isLoading) {
    return (
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-12 bg-white dark:bg-slate-900">
      <div className="max-w-md w-full mx-auto">
        {/* Mobile brand */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">P</span>
          </div>
          <span className="font-bold text-gray-900 dark:text-white">POS System</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Selamat Datang</h1>
          <p className="text-gray-500 dark:text-gray-400">Masuk ke akun Anda untuk melanjutkan</p>
        </div>

        <GoogleAuthButton label="Masuk dengan Google" />

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-slate-700" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white dark:bg-slate-900 px-4 text-xs text-gray-400 uppercase tracking-wider">
              atau masuk dengan email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField
            label="Alamat Email" type="email" required autoComplete="email"
            value={form.email} placeholder="email@contoh.com"
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <PasswordField
            label="Password" required autoComplete="current-password"
            value={form.password} placeholder="Masukkan password"
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          />
          <Button type="submit" fullWidth loading={submitting} size="lg" className="py-3">
            Masuk ke Sistem
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Belum punya akun?{" "}
          <a href="/register" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
            Daftar sekarang
          </a>
        </p>

        {/* Demo credentials */}
        <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">💡 Akun Demo</p>
          {[
            { email: "admin@arukas.com", password: "admin123", label: "Admin" },
            { email: "petugas@arukas.com", password: "petugas123", label: "Petugas" },
          ].map((acc) => (
            <button key={acc.email} type="button"
              onClick={() => setForm({ email: acc.email, password: acc.password })}
              className="w-full text-left text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 py-1 px-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
              👤 {acc.label}: {acc.email} / {acc.password}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}