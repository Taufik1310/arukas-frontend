"use client";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { formatRupiah } from "@/lib/utils";
import { FiRefreshCw, FiCreditCard } from "react-icons/fi";

interface CustomerInfo { name: string; phone: string; email: string }

interface Props {
  subtotal: number;
  change: number;
  method: "cash" | "transfer" | "midtrans";
  paid: number;
  customer: CustomerInfo;
  loading: boolean;
  cartEmpty: boolean;
  onMethodChange: (m: "cash" | "transfer" | "midtrans") => void;
  onPaidChange: (v: number) => void;
  onCustomerChange: (c: CustomerInfo) => void;
  onReset: () => void;
  onCheckout: () => void;
}

const METHODS = [
  { id: "cash",     label: "💵 Tunai"    },
  { id: "transfer", label: "🏦 Transfer" },
  { id: "midtrans", label: "💳 Online"   },
] as const;

export function PaymentPanel({
  subtotal, change, method, paid, customer, loading, cartEmpty,
  onMethodChange, onPaidChange, onCustomerChange, onReset, onCheckout,
}: Props) {
  return (
    <div className="card space-y-3 shrink-0">
      {/* Customer */}
      <FormField
        placeholder="Nama pelanggan (opsional)"
        value={customer.name}
        onChange={(e) => onCustomerChange({ ...customer, name: e.target.value })}
      />
      <FormField
        placeholder="No. HP (untuk notif WA)"
        value={customer.phone}
        onChange={(e) => onCustomerChange({ ...customer, phone: e.target.value })}
      />

      {/* Metode Bayar */}
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">Metode Pembayaran</p>
        <div className="grid grid-cols-3 gap-1.5">
          {METHODS.map((m) => (
            <button key={m.id} onClick={() => onMethodChange(m.id)}
              className={`text-xs py-1.5 rounded-lg border transition-colors ${
                method === m.id
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
              }`}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rincian */}
      <div className="border-t border-gray-200 dark:border-slate-700 pt-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Total</span>
          <span className="font-bold text-base text-gray-900 dark:text-white">{formatRupiah(subtotal)}</span>
        </div>
        {method === "cash" && (
          <>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Uang Bayar</p>
              <FormField
                type="number" min="0"
                value={paid || ""}
                onChange={(e) => onPaidChange(Number(e.target.value))}
                placeholder="0"
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Kembalian</span>
              <span className={`font-bold text-base ${change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                {formatRupiah(change)}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Tombol */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <Button variant="secondary" size="sm" className="py-2.5"
          leftIcon={<FiRefreshCw size={13} />} onClick={onReset} disabled={loading}>
          Reset
        </Button>
        <Button size="sm" className="py-2.5" loading={loading} disabled={cartEmpty}
          leftIcon={<FiCreditCard size={13} />} onClick={onCheckout}>
          Bayar
        </Button>
      </div>
    </div>
  );
}