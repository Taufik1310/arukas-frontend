"use client";
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

// ── Panel Kiri: Branding Register ─────────────────────────────────────────
function LeftPanel() {
  const steps = [
    {
      icon: "📝",
      title: "Isi Data Diri",
      desc:  "Lengkapi nama, email, dan password Anda",
    },
    {
      icon: "✅",
      title: "Akun Siap Digunakan",
      desc:  "Langsung akses kasir POS dan kelola produk",
    },
    {
      icon: "📈",
      title: "Pantau Bisnis Anda",
      desc:  "Lihat laporan dan statistik penjualan real-time",
    },
  ];

  const stats = [
    { label: "Pengguna Aktif", value: "2.4K+" },
    { label: "Transaksi / Hari", value: "18K+" },
    { label: "Uptime",          value: "99.9%" },
  ];

  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-linear-to-br from-indigo-600 via-purple-700 to-pink-700 flex-col justify-between p-12">

      {/* Decorative */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 -left-20 w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute -bottom-16 right-1/4 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute top-24 left-24 w-20 h-20 bg-white/10 rounded-full" />
      </div>

      {/* Logo */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">POS System</span>
        </div>
        <p className="text-purple-200 text-sm">Bergabunglah dengan ribuan pengguna kami</p>
      </div>

      {/* Konten tengah */}
      <div className="relative z-10">
        <h2 className="text-white text-2xl font-bold mb-2">
          Mulai dalam 3 Langkah
        </h2>
        <p className="text-purple-200 text-sm mb-8">
          Daftar gratis dan kelola toko Anda dengan lebih efisien
        </p>

        {/* Steps */}
        <div className="space-y-5">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-4">
              {/* Nomor langkah */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-base">
                  {step.icon}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-0.5 h-6 bg-white/20 mt-2" />
                )}
              </div>
              <div className="pb-1">
                <p className="text-white font-semibold text-sm">{step.title}</p>
                <p className="text-purple-200 text-xs mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats bawah */}
      <div className="relative z-10">
        <div className="grid grid-cols-3 gap-3">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-3 text-center"
            >
              <p className="text-white font-bold text-lg leading-tight">{s.value}</p>
              <p className="text-purple-200 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Testimoni */}
        <div className="mt-4 bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4">
          <p className="text-white/90 text-sm italic leading-relaxed">
            &quot;Dengan POS System, pengelolaan toko jadi jauh lebih mudah.
            Laporan penjualan langsung tersedia kapan saja.&quot;
          </p>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-7 h-7 rounded-full bg-white/30 flex items-center justify-center text-xs font-bold text-white">
              B
            </div>
            <div>
              <p className="text-white text-xs font-medium">Budi Santoso</p>
              <p className="text-purple-200 text-xs">Pemilik Toko Kelontong</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Halaman Register ──────────────────────────────────────────────────────
type Form = {
  name: string; email: string; phone: string;
  password: string; password_confirmation: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<Form>({
    name: "", email: "", phone: "",
    password: "", password_confirmation: "",
  });
  const [submitting, setSub]   = useState(false);
  const [showPass, setShowP]   = useState(false);
  const [showConf, setShowC]   = useState(false);
  const [step, setStep]        = useState(1); // Step 1: info dasar, Step 2: password

  const ch = (key: keyof Form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleGoogle = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/redirect`;
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Nama wajib diisi"); return; }
    if (!form.email.trim()) { toast.error("Email wajib diisi"); return; }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      toast.error("Konfirmasi password tidak sama.");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password minimal 8 karakter.");
      return;
    }
    setSub(true);
    try {
      await authApi.register(form);
      toast.success("Registrasi berhasil! Silakan login.");
      router.push("/login");
    } catch (err: unknown) {
      const errors = (err as { response?: { data?: { errors?: Record<string, string[]> } } })
        ?.response?.data?.errors;
      if (errors) {
        Object.values(errors).flat().forEach((m) => toast.error(m));
      } else {
        toast.error("Registrasi gagal. Coba lagi.");
      }
    } finally {
      setSub(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-900">
      {/* ── Sisi Kiri ── */}
      <LeftPanel />

      {/* ── Sisi Kanan: Form Register ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-12 bg-white dark:bg-slate-900 overflow-y-auto">
        <div className="max-w-md w-full mx-auto">

          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 dark:text-white">POS System</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Buat Akun Baru 🚀
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Daftar gratis dan mulai kelola toko Anda hari ini
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-400"
              }`}>
                {step > 1 ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : "1"}
              </div>
              <span className={`text-xs font-medium ${step >= 1 ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400"}`}>
                Info Dasar
              </span>
            </div>

            <div className={`flex-1 h-0.5 transition-all ${step >= 2 ? "bg-indigo-600" : "bg-gray-200 dark:bg-slate-700"}`} />

            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= 2
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-400"
              }`}>
                2
              </div>
              <span className={`text-xs font-medium ${step >= 2 ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400"}`}>
                Password
              </span>
            </div>
          </div>

          {/* Step 1: Info Dasar */}
          {step === 1 && (
            <>
              {/* Google OAuth */}
              <button
                type="button"
                onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-gray-300 transition-all text-sm font-medium text-gray-700 dark:text-gray-300 mb-6"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Daftar dengan Google
              </button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white dark:bg-slate-900 px-4 text-xs text-gray-400 uppercase tracking-wider">
                    atau isi form
                  </span>
                </div>
              </div>

              <form onSubmit={handleNextStep} className="space-y-4">
                <div>
                  <label className="label">Nama Lengkap *</label>
                  <input
                    className="input py-3"
                    value={form.name}
                    onChange={ch("name")}
                    required
                    placeholder="Masukkan nama lengkap"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label className="label">Alamat Email *</label>
                  <input
                    type="email"
                    className="input py-3"
                    value={form.email}
                    onChange={ch("email")}
                    required
                    placeholder="email@contoh.com"
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label className="label">
                    No. Telepon{" "}
                    <span className="text-gray-400 font-normal text-xs">(opsional)</span>
                  </label>
                  <input
                    className="input py-3"
                    value={form.phone}
                    onChange={ch("phone")}
                    placeholder="08xxxxxxxxxx"
                    autoComplete="tel"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
                >
                  Lanjutkan
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </form>
            </>
          )}

          {/* Step 2: Password */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Ringkasan data step 1 */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{form.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{form.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  Ubah
                </button>
              </div>

              <div>
                <label className="label">Buat Password *</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    className="input py-3 pr-11"
                    value={form.password}
                    onChange={ch("password")}
                    required
                    minLength={8}
                    placeholder="Minimal 8 karakter"
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowP(!showPass)} tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    {showPass ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {/* Password strength indicator */}
                {form.password && (
                  <div className="mt-2 flex gap-1">
                    {[1,2,3,4].map((level) => {
                      const strength =
                        form.password.length >= 12 &&
                        /[A-Z]/.test(form.password) &&
                        /[0-9]/.test(form.password) &&
                        /[^A-Za-z0-9]/.test(form.password) ? 4
                        : form.password.length >= 10 &&
                          (/[A-Z]/.test(form.password) || /[0-9]/.test(form.password)) ? 3
                        : form.password.length >= 8 ? 2
                        : 1;
                      return (
                        <div key={level}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            level <= strength
                              ? strength === 1 ? "bg-red-400"
                              : strength === 2 ? "bg-amber-400"
                              : strength === 3 ? "bg-blue-400"
                              : "bg-green-400"
                              : "bg-gray-200 dark:bg-slate-700"
                          }`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="label">Konfirmasi Password *</label>
                <div className="relative">
                  <input
                    type={showConf ? "text" : "password"}
                    className={`input py-3 pr-11 ${
                      form.password_confirmation &&
                      form.password !== form.password_confirmation
                        ? "border-red-400 focus:ring-red-400"
                        : form.password_confirmation &&
                          form.password === form.password_confirmation
                        ? "border-green-400 focus:ring-green-400"
                        : ""
                    }`}
                    value={form.password_confirmation}
                    onChange={ch("password_confirmation")}
                    required
                    placeholder="Ulangi password"
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowC(!showConf)} tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    {showConf ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {form.password_confirmation &&
                  form.password !== form.password_confirmation && (
                    <p className="text-xs text-red-500 mt-1">Password tidak sama</p>
                  )}
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border-2 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all text-sm"
                >
                  ← Kembali
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Mendaftar...
                    </>
                  ) : (
                    "Buat Akun"
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Link ke login */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Sudah punya akun?{" "}
            <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline">
              Masuk di sini
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}