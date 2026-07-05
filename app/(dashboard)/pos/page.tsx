"use client";
import { CartPanel }    from "@/features/pos/components/CartPanel";
import { PaymentPanel } from "@/features/pos/components/PaymentPanel";
import { ProductGrid }  from "@/features/pos/components/ProductGrid";
import { useCart }      from "@/features/pos/hooks/useCart";
import { useEffect, useState }     from "react";
import { FiCamera }     from "react-icons/fi";
import dynamic from "next/dynamic";

const BarcodeScanner = dynamic(
  () => import("@/components/organisms/BarcodeScanner"),
  { ssr: false }
);

export default function POSPage() {
  const cart = useCart();
  const [scanning,    setScanning]  = useState(false);
  const [, setBSearch] = useState("");

  // Load Midtrans secara dinamis untuk menghindari error Next.js Script
  useEffect(() => {
    const snapUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

    if (!document.querySelector(`script[src="${snapUrl}"]`)) {
      const script = document.createElement("script");
      script.src = snapUrl;
      script.setAttribute("data-client-key", clientKey);
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <>

      <div className="flex gap-4 h-[calc(100vh-3rem)] -mx-6 -mt-6 px-6 pt-6">

        {/* Kiri: Grid produk dengan tombol scan */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tambahkan tombol scan di atas ProductGrid */}
          <div className="flex gap-2 mb-4 shrink-0">
            <div className="flex-1">
              <ProductGrid
                onAdd={cart.addToCart}
              />
            </div>
            <button
              onClick={() => setScanning(true)}
              title="Scan barcode produk"
              className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              <FiCamera size={18} />
            </button>
          </div>
        </div>

        {/* Kanan: Keranjang + Pembayaran */}
        <div className="w-72 xl:w-80 flex flex-col gap-3 shrink-0">
          <CartPanel cart={cart.cart} onUpdateQty={cart.updateQty} />
          <PaymentPanel
            subtotal={cart.subtotal}
            change={cart.change}
            method={cart.method}
            paid={cart.paid}
            customer={cart.customer}
            loading={cart.loading}
            cartEmpty={cart.cart.length === 0}
            onMethodChange={cart.setMethod}
            onPaidChange={cart.setPaid}
            onCustomerChange={cart.setCustomer}
            onReset={cart.reset}
            onCheckout={cart.checkout}
          />
        </div>
      </div>

      {/* Barcode scanner untuk POS */}
      {scanning && (
        <BarcodeScanner
          onDetected={(code) => {
            setBSearch(code);
            setScanning(false);
          }}
          onClose={() => setScanning(false)}
        />
      )}
    </>
  );
}