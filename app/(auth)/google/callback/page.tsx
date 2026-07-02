"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

// Komponen utama callback dipisah karena useSearchParams butuh Suspense
function GoogleCallbackContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const token        = searchParams.get("token");
  const error        = searchParams.get("error");

  const status = error ? "error" : token ? "success" : "loading";
  const message = error
    ? error === "account_disabled"
      ? "Akun Anda tidak aktif. Hubungi administrator."
      : "Login dengan Google gagal. Silakan coba lagi."
    : "Login berhasil! Mengarahkan ke dashboard...";

    useEffect(() => {
        if (error || !token) {
            setTimeout(() => router.replace("/login"), error ? 3000 : 2000);
            return;
        }

        localStorage.setItem("token", token);
        
        // Gunakan hard-reload agar seluruh state dan API membaca token yang baru
        setTimeout(() => {
            window.location.href = "/dashboard";
        }, 1000);
    }, [error, token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-10 w-full max-w-sm text-center">

        {/* Icon status */}
        {status === "loading" && (
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="animate-spin w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        )}

        {status === "success" && (
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}

        {status === "error" && (
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )}

        {/* Google logo kecil */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-sm text-gray-500 dark:text-gray-400">Google OAuth</span>
        </div>

        <h2 className={`text-lg font-bold mb-2 ${
          status === "error"
            ? "text-red-600 dark:text-red-400"
            : "text-gray-900 dark:text-white"
        }`}>
          {status === "loading" && "Memproses Login..."}
          {status === "success" && "Login Berhasil!"}
          {status === "error"   && "Login Gagal"}
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {status === "loading"
            ? "Mohon tunggu, kami sedang memverifikasi akun Google Anda."
            : message}
        </p>

        {/* Progress bar untuk redirect */}
        {status !== "error" && (
          <div className="mt-5 h-1 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                status === "success"
                  ? "bg-green-500 w-full"
                  : "bg-blue-500 w-2/3 animate-pulse"
              }`}
            />
          </div>
        )}

        {status === "error" && (
          <Link
            href="/login"
            className="mt-5 inline-block text-sm text-blue-600 hover:underline font-medium"
          >
            ← Kembali ke halaman login
          </Link>
        )}
      </div>
    </div>
  );
}

// Wrapper dengan Suspense karena useSearchParams membutuhkannya
export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}