import { PageHeader }  from "@/components/molecules/PageHeader";
import { ProductForm } from "@/features/products/components/ProductForm";

export default function ProductCreatePage() {
  return (
    <div>
      <PageHeader
        title="Tambah Produk"
        description="Isi data produk baru"
        actions={<a href="/products" className="btn btn-secondary btn-sm">← Kembali</a>}
      />
      <ProductForm />
    </div>
  );
}