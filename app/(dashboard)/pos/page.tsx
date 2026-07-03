"use client";
import { CartPanel }    from "@/features/pos/components/CartPanel";
import { PaymentPanel } from "@/features/pos/components/PaymentPanel";
import { ProductGrid }  from "@/features/pos/components/ProductGrid";
import { useCart }      from "@/features/pos/hooks/useCart";
import Script from "next/script";

export default function POSPage() {
  const cart = useCart();

  return (
    <>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="beforeInteractive"
      />
      <div className="flex gap-4 h-[calc(100vh-3rem)] -mx-6 -mt-6 px-6 pt-6">
        <ProductGrid onAdd={cart.addToCart} />
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
    </>
  );
}