"use client";
import { useState } from "react";
import api          from "@/lib/api";
import toast        from "react-hot-toast";

interface NotificationPayload {
  type:    "email" | "whatsapp";
  target:  string;       // email atau nomor HP
  message: string;
  subject?: string;      // untuk email
}

export function useNotifications() {
  const [sending, setSending] = useState(false);

  const sendManual = async (payload: NotificationPayload) => {
    setSending(true);
    try {
      await api.post("/notifications/send", payload);
      toast.success(`Notifikasi ${payload.type === "email" ? "email" : "WhatsApp"} berhasil dikirim`);
      return true;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? "Gagal mengirim notifikasi";
      toast.error(msg);
      return false;
    } finally {
      setSending(false);
    }
  };

  const sendTestEmail = async (email: string) => {
    return sendManual({
      type:    "email",
      target:  email,
      subject: "[Test] Notifikasi Email POS System",
      message: "Ini adalah email test dari POS System. Jika Anda menerima email ini, konfigurasi email sudah benar.",
    });
  };

  const sendTestWhatsApp = async (phone: string) => {
    return sendManual({
      type:    "whatsapp",
      target:  phone,
      message: "✅ *Test Notifikasi WhatsApp*\n\nJika Anda menerima pesan ini, konfigurasi WhatsApp Gateway sudah benar.\n\n_POS System_",
    });
  };

  return { sending, sendManual, sendTestEmail, sendTestWhatsApp };
}