"use client";
import { saleApi } from "@/lib/api";
import { CartItem, Product } from "@/types";
import { useState } from "react";
import toast from "react-hot-toast";

export function useCart() {
  const [cart,     setCart]    = useState<CartItem[]>([]);
  const [method,   setMethod]  = useState<"cash"|"transfer"|"midtrans">("cash");
  const [paid,     setPaid]    = useState(0);
  const [customer, setCustomer]= useState({ name:"", phone:"", email:"" });
  const [loading,  setLoading] = useState(false);

  const subtotal = cart.reduce((s, i) => s + i.quantity * i.unit_price, 0);
  const change   = method === "cash" ? Math.max(0, paid - subtotal) : 0;

  const addToCart = (p: Product) => {
    if (p.stock <= 0) { toast.error("Stok habis!"); return; }
    setCart((prev) => {
      const found = prev.find((i) => i.product_id === p.id);
      if (found) {
        if (found.quantity >= p.stock) { toast.error(`Stok tersisa ${p.stock}`); return prev; }
        return prev.map((i) => i.product_id === p.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product_id: p.id, product: p, quantity: 1, unit_price: p.sale_price }];
    });
  };

  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) { setCart((prev) => prev.filter((i) => i.product_id !== id)); return; }
    setCart((prev) => prev.map((i) => i.product_id === id ? { ...i, quantity: qty } : i));
  };

  const reset = () => { setCart([]); setPaid(0); setCustomer({ name:"", phone:"", email:"" }); };

  const checkout = async () => {
    if (!cart.length) { toast.error("Keranjang kosong!"); return; }
    if (method === "cash" && paid < subtotal) { toast.error("Uang bayar kurang!"); return; }
    setLoading(true);
    try {
      const { data } = await saleApi.store({
        items: cart.map((i) => ({ product_id: i.product_id, quantity: i.quantity, unit_price: i.unit_price })),
        total_amount: subtotal, payment_method: method,
        paid_amount: method === "cash" ? paid : subtotal,
        customer_name:  customer.name  || undefined,
        customer_phone: customer.phone || undefined,
        customer_email: customer.email || undefined,
      });

      if (method === "midtrans") {
        const payRes = await saleApi.pay(data.data.id);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).snap?.pay(payRes.data.snap_token, {
          onSuccess: () => { toast.success("Pembayaran berhasil!"); reset(); },
          onPending: () => toast("Menunggu pembayaran..."),
          onError:   () => toast.error("Pembayaran gagal"),
          onClose:   () => toast("Dibatalkan"),
        });
      } else {
        toast.success(`Berhasil! Kembalian: Rp ${(paid - subtotal).toLocaleString("id-ID")}`);
        reset();
      }
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Gagal");
    } finally { setLoading(false); }
  };

  return {
    cart, method, paid, customer, loading, subtotal, change,
    addToCart, updateQty, reset, checkout,
    setMethod, setPaid, setCustomer,
  };
}