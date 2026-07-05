"use client";
import { QRCodeCard } from "@/components/molecules/QRCodeCard";
import Modal          from "@/components/organisms/Modal";
import { Product }    from "@/types";

interface Props {
  product: Product | null;
  onClose: () => void;
}

export function ProductQRModal({ product, onClose }: Props) {
  return (
    <Modal
      open={!!product}
      onClose={onClose}
      title="QR Code Produk"
      size="sm"
    >
      {product && (
        <QRCodeCard
          value={product.code}
          productName={product.name}
          productCode={product.code}
          size={200}
        />
      )}
    </Modal>
  );
}