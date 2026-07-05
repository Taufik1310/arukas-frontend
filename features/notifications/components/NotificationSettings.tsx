"use client";
import { Button }    from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { useState }  from "react";
import { FiMail, FiMessageCircle, FiSend, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useNotifications } from "../hooks/useNotifications";

interface ConfigStatus { configured: boolean; label: string }

export function NotificationSettings() {
  const { sending, sendTestEmail, sendTestWhatsApp } = useNotifications();
  const [testEmail,  setTestEmail]  = useState("");
  const [testPhone,  setTestPhone]  = useState("");

  // Cek apakah env sudah dikonfigurasi (hanya untuk tampilan UI)
  const emailConfig: ConfigStatus = {
    configured: !!(process.env.NEXT_PUBLIC_MAIL_CONFIGURED === "true"),
    label:      "SMTP Email",
  };
  const waConfig: ConfigStatus = {
    configured: !!(process.env.NEXT_PUBLIC_WA_CONFIGURED === "true"),
    label:      "WhatsApp (Fonnte)",
  };

  const handleTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail) return;
    const ok = await sendTestEmail(testEmail);
    if (ok) setTestEmail("");
  };

  const handleTestWa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone) return;
    const ok = await sendTestWhatsApp(testPhone);
    if (ok) setTestPhone("");
  };

  return (
    <div className="space-y-6">
      {/* Email Section */}
      <div className="card space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-slate-700">
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <FiMail size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              Email Notification
            </h3>
            <p className="text-xs text-gray-400">
              Struk pembelian & alert stok rendah via email
            </p>
          </div>
          <StatusBadge configured={emailConfig.configured} className="ml-auto" />
        </div>

        <div className="text-xs space-y-1.5 text-gray-500 dark:text-gray-400">
          <p>Notifikasi dikirim otomatis saat:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-1">
            <li>Transaksi penjualan berhasil (ke email pelanggan)</li>
            <li>Stok produk di bawah minimum (ke admin)</li>
            <li>Pembayaran Midtrans dikonfirmasi</li>
          </ul>
        </div>

        <form onSubmit={handleTestEmail} className="flex gap-2">
          <FormField
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="Email untuk test..."
            containerClassName="flex-1"
          />
          <Button
            type="submit"
            variant="outline" size="sm"
            loading={sending}
            leftIcon={<FiSend size={13} />}
            disabled={!testEmail}
          >
            Kirim Test
          </Button>
        </form>
      </div>

      {/* WhatsApp Section */}
      <div className="card space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-slate-700">
          <div className="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <FiMessageCircle size={18} className="text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              WhatsApp Gateway
            </h3>
            <p className="text-xs text-gray-400">
              Struk & notifikasi via WhatsApp (Fonnte API)
            </p>
          </div>
          <StatusBadge configured={waConfig.configured} className="ml-auto" />
        </div>

        <div className="text-xs space-y-1.5 text-gray-500 dark:text-gray-400">
          <p>Pesan WhatsApp dikirim otomatis saat:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-1">
            <li>Transaksi selesai (ke nomor HP pelanggan)</li>
            <li>Stok rendah (ke nomor HP admin)</li>
            <li>Pembayaran online dikonfirmasi</li>
          </ul>
        </div>

        <form onSubmit={handleTestWa} className="flex gap-2">
          <FormField
            type="tel"
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value)}
            placeholder="08xxxxxxxxxx"
            containerClassName="flex-1"
          />
          <Button
            type="submit"
            variant="outline" size="sm"
            loading={sending}
            leftIcon={<FiSend size={13} />}
            disabled={!testPhone}
            className="text-green-600 border-green-300 hover:bg-green-50 dark:text-green-400 dark:border-green-700 dark:hover:bg-green-900/20"
          >
            Kirim Test
          </Button>
        </form>

        {/* Setup guide */}
        <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-3 space-y-1">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
            Cara setup Fonnte:
          </p>
          <ol className="text-xs text-gray-500 dark:text-gray-400 list-decimal list-inside space-y-0.5">
            <li>Daftar di <a href="https://fonnte.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">fonnte.com</a></li>
            <li>Tambahkan perangkat WhatsApp</li>
            <li>Salin API token ke <code className="bg-gray-200 dark:bg-slate-600 px-1 rounded">.env → FONNTE_TOKEN</code></li>
          </ol>
        </div>
      </div>
    </div>
  );
}

// ── Status Badge ───────────────────────────────────────────────────────────
function StatusBadge({
  configured,
  className,
}: {
  configured: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
      configured
        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
    } ${className}`}>
      {configured
        ? <><FiCheckCircle size={11} /> Aktif</>
        : <><FiAlertCircle size={11} /> Belum dikonfigurasi</>
      }
    </div>
  );
}