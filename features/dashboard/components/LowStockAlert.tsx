import { FiAlertTriangle } from "react-icons/fi";

interface Props { count: number }

export function LowStockAlert({ count }: Props) {
  if (count <= 0) return null;
  return (
    <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3">
      <FiAlertTriangle size={18} className="text-amber-500 shrink-0" />
      <p className="text-sm text-amber-800 dark:text-amber-300">
        <strong>{count} produk</strong> memiliki stok di bawah minimum.{" "}
        <a href="/products?low_stock=1" className="underline font-medium hover:no-underline">
          Lihat produk →
        </a>
      </p>
    </div>
  );
}