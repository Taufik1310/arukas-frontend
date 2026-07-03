"use client";
import { Spinner }     from "@/components/atoms/Spinner";
import { PageHeader }  from "@/components/molecules/PageHeader";
import { ProductForm } from "@/features/products/components/ProductForm";
import { productApi }  from "@/lib/api";
import { Product }     from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ProductEditPage() {
  const { id } = useParams();
  const router  = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productApi.get(Number(id))
      .then((r) => setProduct(r.data.data))
      .catch(() => { toast.error("Produk tidak ditemukan"); router.push("/products"); })
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Spinner size="lg" className="text-blue-600" />
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Edit Produk"
        description={`Perbarui data: ${product?.name}`}
        actions={<a href="/products" className="btn btn-secondary btn-sm">← Kembali</a>}
      />
      {product && <ProductForm product={product} />}
    </div>
  );
}