"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { FiX } from "react-icons/fi";

interface ImagePreviewProps {
  src: string;
  alt?: string;
  isNew?: boolean;
  onRemove?: () => void;
  className?: string;
}

export function ImagePreview({
  src, alt = "", isNew = false, onRemove, className,
}: ImagePreviewProps) {
  return (
    <div className={cn("relative group overflow-hidden rounded-xl border-2 transition-all",
      isNew
        ? "border-blue-400 dark:border-blue-500"
        : "border-gray-200 dark:border-slate-600",
      className,
    )}>
      {/* Gambar */}
      <Image
        src={src}
        alt={alt}
        width={96}
        height={96}
        className="w-full h-24 object-cover"
        unoptimized
      />

      {/* Overlay hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all" />

      {/* Badge baru */}
      {isNew && (
        <span className="absolute bottom-0 inset-x-0 bg-blue-500/90 text-white text-center text-xs py-0.5 font-medium">
          Baru
        </span>
      )}

      {/* Tombol hapus */}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className={cn(
            "absolute top-1.5 right-1.5",
            "w-6 h-6 rounded-full",
            "bg-red-500 hover:bg-red-600 text-white",
            "flex items-center justify-center",
            "opacity-0 group-hover:opacity-100 transition-opacity",
            "shadow-md",
          )}
          aria-label="Hapus gambar"
        >
          <FiX size={12} />
        </button>
      )}
    </div>
  );
}