"use client";
import { Badge } from "@/components/atoms/Badge";
import { formatRupiah } from "@/lib/utils";
import { CartItem } from "@/types";
import { FiMinus, FiPlus, FiShoppingCart } from "react-icons/fi";

interface Props {
  cart: CartItem[];
  onUpdateQty: (id: number, qty: number) => void;
}

export function CartPanel({ cart, onUpdateQty }: Props) {
  return (
    <div className="card flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <h2 className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
          <FiShoppingCart size={15} /> Keranjang
        </h2>
        {cart.length > 0 && <Badge variant="blue">{cart.length} item</Badge>}
      </div>
      <div className="flex-1 overflow-y-auto space-y-2">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8">
            <FiShoppingCart size={32} className="mb-2 opacity-40" />
            <p className="text-sm">Keranjang kosong</p>
            <p className="text-xs mt-1">Klik produk untuk menambah</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.product_id} className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700 rounded-lg px-3 py-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate text-gray-900 dark:text-white">{item.product.name}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">{formatRupiah(item.unit_price)}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => onUpdateQty(item.product_id, item.quantity - 1)}
                  className="w-6 h-6 rounded bg-gray-200 dark:bg-slate-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors">
                  <FiMinus size={12} />
                </button>
                <span className="text-sm font-semibold w-6 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                <button onClick={() => onUpdateQty(item.product_id, item.quantity + 1)}
                  className="w-6 h-6 rounded bg-gray-200 dark:bg-slate-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors">
                  <FiPlus size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}