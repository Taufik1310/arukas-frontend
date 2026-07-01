"use client";
import { productApi, saleApi } from "@/lib/api";
import { formatRupiah } from "@/lib/utils";
import { CartItem, Product } from "@/types";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search,   setSearch]   = useState("");
  const [cart,     setCart]     = useState<CartItem[]>([]);
  const [method,   setMethod]   = useState<"cash" | "transfer" | "midtrans">("cash");
  const [paid,     setPaid]     = useState<number>(0);
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "" });
  const [loading,  setLoading]  = useState(false);

  // Hitung total
  const subtotal = cart.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );
  const change = method === "cash" ? Math.max(0, paid - subtotal) : 0;

  // ── Load Midtrans Snap Script ──
  useEffect(() => {
    const snapUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

    // Cegah duplikasi script jika komponen di-render ulang
    if (!document.querySelector(`script[src="${snapUrl}"]`)) {
      const script = document.createElement("script");
      script.src = snapUrl;
      script.setAttribute("data-client-key", clientKey);
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Cari produk dengan debounce 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      productApi
        .list({ search, per_page: 24, is_active: true })
        .then((r) => setProducts(r.data.data))
        .catch(() => setProducts([]));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Tambah produk ke keranjang
  const addToCart = (p: Product) => {
    if (p.stock <= 0) {
      toast.error("Stok produk habis!");
      return;
    }
    setCart((prev) => {
      const found = prev.find((i) => i.product_id === p.id);
      if (found) {
        if (found.quantity >= p.stock) {
          toast.error(`Stok hanya tersisa ${p.stock}`);
          return prev;
        }
        return prev.map((i) =>
          i.product_id === p.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [
        ...prev,
        {
          product_id: p.id,
          product: p,
          quantity: 1,
          unit_price: p.sale_price,
        },
      ];
    });
  };

  // Update qty atau hapus jika qty = 0
  const updateQty = (product_id: number, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.product_id !== product_id));
      return;
    }
    setCart((prev) =>
      prev.map((i) =>
        i.product_id === product_id ? { ...i, quantity: qty } : i
      )
    );
  };

  // Reset keranjang
  const resetCart = () => {
    setCart([]);
    setPaid(0);
    setCustomer({ name: "", phone: "", email: "" });
  };

  // Proses checkout
  const checkout = async () => {
    if (cart.length === 0) {
      toast.error("Keranjang masih kosong!");
      return;
    }
    if (method === "cash" && paid < subtotal) {
      toast.error("Uang bayar kurang dari total!");
      return;
    }

    setLoading(true);
    try {
      const { data } = await saleApi.store({
        items: cart.map((i) => ({
          product_id: i.product_id,
          quantity:   i.quantity,
          unit_price: i.unit_price,
        })),
        total_amount:   subtotal,
        payment_method: method,
        paid_amount:    method === "cash" ? paid : subtotal,
        customer_name:  customer.name  || undefined,
        customer_phone: customer.phone || undefined,
        customer_email: customer.email || undefined,
      });

      if (method === "midtrans") {
        // Buka Midtrans Snap popup
        const payRes = await saleApi.pay(data.data.id);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).snap?.pay(payRes.data.snap_token, {
          onSuccess: () => {
            toast.success("Pembayaran berhasil!");
            resetCart();
          },
          onPending: () => toast("Menunggu pembayaran..."),
          onError:   () => toast.error("Pembayaran gagal"),
          onClose:   () => toast("Pembayaran dibatalkan"),
        });
      } else {
        toast.success(
          `Transaksi berhasil! Kembalian: ${formatRupiah(change)}`
        );
        resetCart();
      }
    } catch (err: unknown) {
      toast.error(
        (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ?? "Transaksi gagal"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex gap-4 h-[calc(100vh-3rem)] -mx-6 -mt-6 px-6 pt-6">
        {/* ── KIRI: Grid Produk ── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Search */}
          <input
            className="input mb-4 shrink-0"
            placeholder="🔍 Cari produk atau ketik barcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 overflow-y-auto flex-1 pb-4">
            {products.length === 0 && (
              <div className="col-span-full flex items-center justify-center h-48 text-gray-400 text-sm">
                {search ? "Produk tidak ditemukan" : "Memuat produk..."}
              </div>
            )}
            {products.map((p) => (
              <button
                key={p.id}
                onClick={() => addToCart(p)}
                disabled={p.stock <= 0}
                className={`card text-left transition-all ${
                  p.stock > 0
                    ? "hover:border-blue-400 hover:shadow-md cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                {/* Gambar produk */}
                {p.image_urls[0] ? (
                  <div className="w-full h-24 relative rounded-lg overflow-hidden mb-2">
                    <Image
                      src={p.image_urls[0]}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-24 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-3xl mb-2">
                    📦
                  </div>
                )}
                <p className="text-xs font-semibold line-clamp-2 leading-tight text-gray-900 dark:text-white">
                  {p.name}
                </p>
                <p className="text-blue-600 dark:text-blue-400 font-bold text-sm mt-1">
                  {formatRupiah(p.sale_price)}
                </p>
                <p
                  className={`text-xs mt-0.5 ${
                    p.is_low_stock ? "text-red-500 font-medium" : "text-gray-400"
                  }`}
                >
                  Stok: {p.stock} {p.unit}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* ── KANAN: Panel Keranjang ── */}
        <div className="w-72 xl:w-80 flex flex-col gap-3 shrink-0">
          {/* Daftar item keranjang */}
          <div className="card flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <h2 className="font-semibold text-gray-900 dark:text-white text-sm">
                Keranjang
              </h2>
              {cart.length > 0 && (
                <span className="badge-blue">{cart.length} item</span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8">
                  <span className="text-4xl mb-2">🛒</span>
                  <p className="text-sm">Keranjang kosong</p>
                  <p className="text-xs mt-1">Klik produk untuk menambah</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product_id}
                    className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700 rounded-lg px-3 py-2"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate text-gray-900 dark:text-white">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        {formatRupiah(item.unit_price)}
                      </p>
                    </div>
                    {/* Kontrol qty */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() =>
                          updateQty(item.product_id, item.quantity - 1)
                        }
                        className="w-6 h-6 rounded bg-gray-200 dark:bg-slate-600 text-sm font-bold flex items-center justify-center hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors"
                      >
                        −
                      </button>
                      <span className="text-sm font-semibold w-6 text-center text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQty(item.product_id, item.quantity + 1)
                        }
                        className="w-6 h-6 rounded bg-gray-200 dark:bg-slate-600 text-sm font-bold flex items-center justify-center hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Panel Bayar */}
          <div className="card space-y-3 shrink-0">
            {/* Data pelanggan */}
            <input
              className="input text-sm"
              placeholder="Nama pelanggan (opsional)"
              value={customer.name}
              onChange={(e) =>
                setCustomer((p) => ({ ...p, name: e.target.value }))
              }
            />
            <input
              className="input text-sm"
              placeholder="No. HP (untuk notif WA)"
              value={customer.phone}
              onChange={(e) =>
                setCustomer((p) => ({ ...p, phone: e.target.value }))
              }
            />

            {/* Pilih metode bayar */}
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                Metode Pembayaran
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: "cash",     label: "💵 Tunai" },
                    { id: "transfer", label: "🏦 Transfer" },
                    { id: "midtrans", label: "💳 Online" },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`text-xs py-1.5 rounded-lg border transition-colors ${
                      method === m.id
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rincian bayar */}
            <div className="border-t border-gray-200 dark:border-slate-700 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Total</span>
                <span className="font-bold text-gray-900 dark:text-white text-base">
                  {formatRupiah(subtotal)}
                </span>
              </div>

              {/* Hanya tampilkan jika bayar tunai */}
              {method === "cash" && (
                <>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Uang Bayar
                    </p>
                    <input
                      type="number"
                      className="input text-sm"
                      value={paid || ""}
                      onChange={(e) => setPaid(Number(e.target.value))}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Kembalian
                    </span>
                    <span
                      className={`font-bold text-base ${
                        change >= 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-500"
                      }`}
                    >
                      {formatRupiah(change)}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Tombol aksi */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={resetCart}
                className="btn-secondary text-sm py-2.5"
                disabled={loading}
              >
                🗑 Reset
              </button>
              <button
                onClick={checkout}
                disabled={loading || cart.length === 0}
                className="btn-primary text-sm py-2.5 disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="animate-spin h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12" cy="12" r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Proses...
                  </span>
                ) : (
                  "💳 Bayar"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}