"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// ── Panel Kiri: Branding & Ilustrasi ─────────────────────────────────────
function LeftPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 flex-col justify-between p-12">

      {/* Background decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute -bottom-20 left-1/3 w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full" />
      </div>

      {/* Logo & Brand */}
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
        <p className="text-blue-200 text-sm">Point of Sales — Solusi Kasir Modern</p>
      </div>

      {/* Ilustrasi tengah */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Ilustrasi SVG kasir */}
        <div className="w-64 h-64 mb-8 relative">
          <svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Monitor kasir */}
            <rect x="60" y="40" width="160" height="110" rx="10" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.3" strokeWidth="1.5"/>
            <rect x="70" y="50" width="140" height="90" rx="6" fill="white" fillOpacity="0.1"/>
            {/* Layar konten */}
            <rect x="80" y="60" width="60" height="8" rx="4" fill="white" fillOpacity="0.4"/>
            <rect x="80" y="75" width="40" height="6" rx="3" fill="white" fillOpacity="0.25"/>
            <rect x="80" y="88" width="50" height="6" rx="3" fill="white" fillOpacity="0.25"/>
            <rect x="80" y="101" width="35" height="6" rx="3" fill="white" fillOpacity="0.25"/>
            {/* Panel kanan layar */}
            <rect x="155" y="60" width="45" height="70" rx="4" fill="white" fillOpacity="0.1"/>
            <rect x="162" y="68" width="30" height="6" rx="3" fill="white" fillOpacity="0.3"/>
            <rect x="162" y="80" width="20" height="20" rx="3" fill="white" fillOpacity="0.2"/>
            <rect x="162" y="106" width="30" height="8" rx="4" fill="#34d399" fillOpacity="0.8"/>
            {/* Stand monitor */}
            <rect x="125" y="150" width="30" height="8" rx="2" fill="white" fillOpacity="0.2"/>
            <rect x="110" y="156" width="60" height="6" rx="3" fill="white" fillOpacity="0.15"/>
            {/* Keyboard/kasir bawah */}
            <rect x="75" y="175" width="130" height="60" rx="8" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.2" strokeWidth="1"/>
            {/* Tombol-tombol kasir */}
            {[0,1,2,3].map(col =>
              [0,1,2].map(row => (
                <rect key={`${col}-${row}`}
                  x={88 + col * 28} y={185 + row * 16}
                  width="20" height="10" rx="3"
                  fill="white" fillOpacity={row === 2 && col === 3 ? "0.4" : "0.15"}
                />
              ))
            )}
            {/* Coin/uang floating */}
            <circle cx="220" cy="80" r="18" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.3" strokeWidth="1.5"/>
            <text x="220" y="85" textAnchor="middle" fill="white" fillOpacity="0.5" fontSize="14" fontWeight="bold">Rp</text>
            <circle cx="45" cy="160" r="14" fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.2" strokeWidth="1.5"/>
            <text x="45" y="164" textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="10" fontWeight="bold">%</text>
          </svg>

          {/* Floating stat cards */}
          <div className="absolute -top-2 -right-6 bg-white/15 backdrop-blur border border-white/20 rounded-xl px-3 py-2 text-left shadow-lg">
            <p className="text-white/60 text-xs">Penjualan Hari Ini</p>
            <p className="text-white font-bold text-sm">Rp 4.250.000</p>
          </div>
          <div className="absolute bottom-4 -left-8 bg-white/15 backdrop-blur border border-white/20 rounded-xl px-3 py-2 text-left shadow-lg">
            <p className="text-white/60 text-xs">Transaksi</p>
            <p className="text-white font-bold text-sm">128 hari ini</p>
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-white text-2xl font-bold leading-tight mb-3">
          Kelola Toko Anda<br />dengan Lebih Cerdas
        </h2>
        <p className="text-blue-200 text-sm leading-relaxed max-w-xs">
          Sistem kasir modern yang memudahkan pengelolaan produk,
          transaksi penjualan, dan laporan keuangan dalam satu platform.
        </p>
      </div>

      {/* Feature list bawah */}
      <div className="relative z-10 space-y-3">
        {[
          { icon: "⚡", text: "Proses transaksi lebih cepat dengan kasir POS" },
          { icon: "📊", text: "Laporan penjualan real-time dan akurat" },
          { icon: "🔒", text: "Data aman dengan enkripsi dan audit trail" },
        ].map((f, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0 text-base">
              {f.icon}
            </div>
            <p className="text-blue-100 text-sm">{f.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Halaman Login ─────────────────────────────────────────────────────────
export default function LoginPage() {
  const { login, user, isLoading } = useAuth();
  const router = useRouter();
  const [form, setForm]      = useState({ email: "admin@pos.com", password: "password" });
  const [submitting, setSub] = useState(false);
  const [showPass, setShow]  = useState(false);

  useEffect(() => {
    if (!isLoading && user) router.replace("/dashboard");
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSub(true);
    try {
      await login(form.email, form.password);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ?? "Email atau password salah.";
      toast.error(msg);
    } finally {
      setSub(false);
    }
  };

  const handleGoogle = () => {
    // Redirect ke backend untuk memulai alur Google OAuth
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/redirect`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-900">
      {/* ── Sisi Kiri: Branding ── */}
      <LeftPanel />

      {/* ── Sisi Kanan: Form Login ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-12 bg-white dark:bg-slate-900">
        <div className="max-w-md w-full mx-auto">

          {/* Header mobile (hanya muncul di layar kecil) */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 dark:text-white">POS System</span>
          </div>

          {/* Judul form */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Selamat Datang 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Masuk ke akun Anda untuk melanjutkan
            </p>
          </div>

          {/* Tombol Google */}
          <button
            type="button"
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-500 transition-all text-sm font-medium text-gray-700 dark:text-gray-300 mb-6"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Masuk dengan Google
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white dark:bg-slate-900 px-4 text-xs text-gray-400 uppercase tracking-wider">
                atau masuk dengan email
              </span>
            </div>
          </div>

          {/* Form email & password */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Alamat Email</label>
              <input
                type="email"
                className="input py-3"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
                autoComplete="email"
                placeholder="email@contoh.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="label mb-0">Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  className="input py-3 pr-11"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  required
                  autoComplete="current-password"
                  placeholder="Masukkan password"
                />
                <button
                  type="button"
                  onClick={() => setShow(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Memproses...
                </>
              ) : (
                "Masuk ke Sistem"
              )}
            </button>
          </form>

          {/* Link ke register */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Belum punya akun?{" "}
            <a href="/register" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
              Daftar sekarang
            </a>
          </p>

          {/* Demo credentials */}
          <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-1">
              <span>💡</span> Akun Demo
            </p>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setForm({ email: "admin@pos.com", password: "password" })}
                className="w-full text-left text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 py-1 px-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              >
                👤 Admin: admin@pos.com / password
              </button>
              <button
                type="button"
                onClick={() => setForm({ email: "petugas@pos.com", password: "password" })}
                className="w-full text-left text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 py-1 px-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              >
                👤 Petugas: petugas@pos.com / password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}