"use client";
import { Button }           from "@/components/atoms/Button";
import { PageHeader }       from "@/components/molecules/PageHeader";
import { ProductFilters }   from "@/features/products/components/ProductFilters";
import { ProductTable }     from "@/features/products/components/ProductTable";
import { ProductQRModal }   from "@/features/products/components/ProductQRModal";
import { useProducts }      from "@/features/products/hooks/useProducts";
import { FiDownload, FiPlus } from "react-icons/fi";
import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamic import agar tidak di-load di server
const Scanner = dynamic(
  () => import("@/components/organisms/BarcodeScanner"),
  { ssr: false }
);

export default function ProductsPage() {
  const p = useProducts();

  return (
    <div className="space-y-5">
      <PageHeader
        title="Data Produk"
        description="Kelola semua produk toko"
        actions={
          <>
            <Button variant="outline" size="sm" leftIcon={<FiDownload size={13} />}
              onClick={() => p.handleExport("excel")}>Excel</Button>
            <Button variant="outline" size="sm" leftIcon={<FiDownload size={13} />}
              onClick={() => p.handleExport("pdf")}>PDF</Button>
            <Link href="/products/create">
              <Button size="sm" leftIcon={<FiPlus size={14} />}>Tambah Produk</Button>
            </Link>
          </>
        }
      />

      <div className="card">
        <ProductFilters
          search={p.search}
          catFilter={p.catFilter}
          categories={p.categories}
          onSearchChange={p.handleSearchChange}
          onCatChange={p.handleCatChange}
          onScan={p.startScan}
        />
        <ProductTable
          products={p.products}
          loading={p.loading}
          deleting={p.deleting}
          meta={p.meta}
          onDelete={p.handleDelete}
          onQr={p.openQr}
          onPageChange={p.setPage}
        />
      </div>

      {/* Barcode Scanner — organism */}
      {p.scanning && (
        <Scanner
          onDetected={(code) => {
            p.handleSearchChange(code);
            p.stopScan();
          }}
          onClose={p.stopScan}
        />
      )}

      {/* QR Code Modal — feature component */}
      <ProductQRModal
        product={p.qrProduct}
        onClose={p.closeQr}
      />
    </div>
  );
}