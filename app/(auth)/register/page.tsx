"use client";
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

type Form = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<Form>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
  });
  const [submitting, setSub] = useState(false);

  const ch =
    (key: keyof Form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      toast.error("Konfirmasi password tidak sama.");
      return;
    }
    setSub(true);
    try {
      await authApi.register(form);
      toast.success("Registrasi berhasil! Silakan login.");
      router.push("/login");
    } catch (err: unknown) {
      const errors = (
        err as {
          response?: { data?: { errors?: Record<string, string[]> } };
        }
      )?.response?.data?.errors;
      if (errors) {
        Object.values(errors)
          .flat()
          .forEach((m) => toast.error(m));
      } else {
        toast.error("Registrasi gagal. Coba lagi.");
      }
    } finally {
      setSub(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="card shadow-xl">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-1">
          Buat Akun
        </h1>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
          Daftar sebagai petugas kasir
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Nama Lengkap *</label>
            <input
              className="input"
              value={form.name}
              onChange={ch("name")}
              required
              placeholder="Nama lengkap"
            />
          </div>
          <div>
            <label className="label">Email *</label>
            <input
              type="email"
              className="input"
              value={form.email}
              onChange={ch("email")}
              required
              placeholder="email@contoh.com"
            />
          </div>
          <div>
            <label className="label">No. Telepon</label>
            <input
              className="input"
              value={form.phone}
              onChange={ch("phone")}
              placeholder="08xxxxxxxxxx"
            />
          </div>
          <div>
            <label className="label">Password *</label>
            <input
              type="password"
              className="input"
              value={form.password}
              onChange={ch("password")}
              required
              minLength={8}
              placeholder="Minimal 8 karakter"
            />
          </div>
          <div>
            <label className="label">Konfirmasi Password *</label>
            <input
              type="password"
              className="input"
              value={form.password_confirmation}
              onChange={ch("password_confirmation")}
              required
              placeholder="Ulangi password"
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-2.5"
            disabled={submitting}
          >
            {submitting ? "Memproses..." : "Daftar Sekarang"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
          Sudah punya akun?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Masuk
          </a>
        </p>
      </div>
    </div>
  );
}