"use client";
import { ImagePreview } from "@/components/atoms/ImagePreview";
import { cn }           from "@/lib/utils";
import { useRef, useState, useCallback } from "react";
import { FiUploadCloud, FiImage } from "react-icons/fi";
import toast from "react-hot-toast";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_MB    = 2;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface MultiImageUploadProps {
  onChange:          (files: File[]) => void;
  existingUrls?:     string[];
  onRemoveExisting?: (url: string) => void;
  maxFiles?:         number;
  className?:        string;
  disabled?:         boolean;
}

interface PreviewItem {
  file:    File;
  preview: string;
}

export default function MultiImageUpload({
  onChange,
  existingUrls = [],
  onRemoveExisting,
  maxFiles  = 5,
  className,
  disabled  = false,
}: MultiImageUploadProps) {
  const [previews,  setPreviews]  = useState<PreviewItem[]>([]);
  const [isDragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalImages = existingUrls.length + previews.length;
  const canAddMore  = totalImages < maxFiles && !disabled;
  const remaining   = maxFiles - totalImages;

  // ── Validate & process files ───────────────────────────────────────────
  const processFiles = useCallback(
    (rawFiles: FileList | File[]) => {
      const files = Array.from(rawFiles);

      // Filter valid files
      const validFiles: File[] = [];
      for (const file of files) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          toast.error(`${file.name}: Format tidak didukung (gunakan JPG, PNG, WEBP)`);
          continue;
        }
        if (file.size > MAX_SIZE_BYTES) {
          toast.error(`${file.name}: Ukuran melebihi ${MAX_SIZE_MB}MB`);
          continue;
        }
        validFiles.push(file);
      }

      if (!validFiles.length) return;

      // Batasi jumlah file
      const allowed = validFiles.slice(0, remaining);
      if (allowed.length < validFiles.length) {
        toast(`Hanya ${remaining} gambar lagi yang bisa ditambahkan`, { icon: "ℹ️" });
      }

      // Buat preview URL
      const newPreviews: PreviewItem[] = allowed.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setPreviews((prev) => [...prev, ...newPreviews]);
      onChange(allowed);
    },
    [remaining, onChange]
  );

  // ── Drag & Drop handlers ───────────────────────────────────────────────
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); if (canAddMore) setDragging(true);
  };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    if (!canAddMore) return;
    processFiles(e.dataTransfer.files);
  };

  // ── File input change ──────────────────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) processFiles(e.target.files);
    if (inputRef.current) inputRef.current.value = "";
  };

  // ── Remove new preview ─────────────────────────────────────────────────
  const removePreview = (idx: number) => {
    setPreviews((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[idx].preview);
      updated.splice(idx, 1);
      return updated;
    });
  };

  return (
    <div className={cn("space-y-4", className)}>

      {/* Existing Images */}
      {existingUrls.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            Gambar Tersimpan ({existingUrls.length})
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {existingUrls.map((url, i) => (
              <ImagePreview
                key={`existing-${i}`}
                src={url}
                alt={`Gambar ${i + 1}`}
                isNew={false}
                onRemove={onRemoveExisting ? () => onRemoveExisting(url) : undefined}
              />
            ))}
          </div>
        </div>
      )}

      {/* New Previews */}
      {previews.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            Gambar Baru ({previews.length})
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {previews.map((item, i) => (
              <ImagePreview
                key={`new-${i}`}
                src={item.preview}
                alt={item.file.name}
                isNew={true}
                onRemove={() => removePreview(i)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Upload Zone */}
      {canAddMore && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-6",
            "flex flex-col items-center gap-2 cursor-pointer",
            "transition-all duration-200",
            isDragging
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.01]"
              : "border-gray-300 dark:border-slate-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-slate-700/50",
            disabled && "pointer-events-none opacity-50",
          )}
        >
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
            isDragging
              ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600"
              : "bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500",
          )}>
            <FiUploadCloud size={22} />
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isDragging ? "Lepaskan gambar di sini" : "Klik atau drag gambar"}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              JPG, PNG, WEBP — maks {MAX_SIZE_MB}MB/file
            </p>
          </div>

          {/* Counter */}
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
            totalImages >= maxFiles
              ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
              : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
          )}>
            <FiImage size={12} />
            {totalImages}/{maxFiles} gambar — {remaining} slot tersisa
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            multiple
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      )}

      {/* Full message */}
      {!canAddMore && !disabled && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <FiImage size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />
          <p className="text-xs text-amber-700 dark:text-amber-400">
            Sudah mencapai batas maksimal <strong>{maxFiles} gambar</strong>.
            Hapus gambar yang ada untuk menambah yang baru.
          </p>
        </div>
      )}
    </div>
  );
}