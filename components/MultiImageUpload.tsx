"use client";
import { useRef, useState } from "react";
import Image from "next/image";

interface Props {
  onChange: (files: File[]) => void;
  existingUrls?: string[];
  onRemoveExisting?: (url: string) => void;
  maxFiles?: number;
}

export default function MultiImageUpload({
  onChange,
  existingUrls = [],
  onRemoveExisting,
  maxFiles = 5,
}: Props) {
  const [previews, setPreviews] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const remaining = maxFiles - existingUrls.length - previews.length;
    const allowed   = files.slice(0, remaining);

    if (allowed.length < files.length) {
      // informasi jika ada yang dipotong sudah cukup dengan batasan visual
    }

    onChange(allowed);
    const urls = allowed.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...urls].slice(0, maxFiles));

    // Reset input agar bisa pilih file yang sama lagi
    if (inputRef.current) inputRef.current.value = "";
  };

  const removePreview = (idx: number) => {
    setPreviews((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      return next;
    });
  };

  const totalImages = existingUrls.length + previews.length;
  const canAddMore  = totalImages < maxFiles;

  return (
    <div className="space-y-3">

      {/* Gambar yang sudah tersimpan */}
      {existingUrls.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            Gambar tersimpan:
          </p>
          <div className="grid grid-cols-4 gap-2">
            {existingUrls.map((url, i) => (
              <div key={`existing-${i}`} className="relative group">
                <Image
                  src={url}
                  alt={`Gambar ${i + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-20 object-cover rounded-lg border border-gray-200 dark:border-slate-600"
                />
                {onRemoveExisting && (
                  <button
                    type="button"
                    onClick={() => onRemoveExisting(url)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-sm"
                    title="Hapus gambar"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview gambar baru */}
      {previews.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            Gambar baru:
          </p>
          <div className="grid grid-cols-4 gap-2">
            {previews.map((url, i) => (
              <div key={`preview-${i}`} className="relative group">
                <Image
                  src={url}
                  alt={`Preview ${i + 1}`}
                  width={80}
                  height={80}
                  unoptimized
                  className="w-full h-20 object-cover rounded-lg border-2 border-blue-400"
                />
                <button
                  type="button"
                  onClick={() => removePreview(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-sm"
                  title="Hapus gambar"
                >
                  ✕
                </button>
                <span className="absolute bottom-0 inset-x-0 bg-blue-500/80 text-white text-center text-xs py-0.5 rounded-b-lg">
                  Baru
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Area upload */}
      {canAddMore && (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-5 flex flex-col items-center gap-2 cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
        >
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Klik atau drag gambar ke sini
          </p>
          <p className="text-xs text-gray-400">
            PNG, JPG, WEBP — maks {maxFiles} gambar, 2MB/file
          </p>
          <p className="text-xs text-blue-500">
            {totalImages}/{maxFiles} gambar dipilih
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            className="hidden"
          />
        </div>
      )}

      {/* Info jika sudah penuh */}
      {!canAddMore && (
        <p className="text-xs text-center text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg py-2">
          Maksimal {maxFiles} gambar sudah tercapai
        </p>
      )}
    </div>
  );
}