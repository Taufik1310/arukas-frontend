"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
  onReady?: (canvas: HTMLCanvasElement) => void;
}

export function QRCode({ value, size = 160, className, onReady }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error,   setError]   = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!canvasRef.current || !value) return;
    setLoading(true);
    setError(false);

    import("qrcode")
      .then((QRCode) =>
        QRCode.toCanvas(canvasRef.current!, value, {
          width:  size,
          margin: 2,
          color: {
            dark:  "#0f172a",
            light: "#ffffff",
          },
          errorCorrectionLevel: "M",
        })
      )
      .then(() => {
        setLoading(false);
        if (onReady && canvasRef.current) onReady(canvasRef.current);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [value, size, onReady]);

  if (error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gray-100 dark:bg-slate-700 rounded-lg text-gray-400 text-xs",
          className,
        )}
        style={{ width: size, height: size }}
      >
        Gagal memuat
      </div>
    );
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {loading && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "bg-gray-100 dark:bg-slate-700 rounded-lg",
          )}
        >
          <div className="animate-pulse w-8 h-8 bg-gray-300 dark:bg-slate-600 rounded" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={cn("rounded-lg", loading && "opacity-0", className)}
        style={{ width: size, height: size }}
      />
    </div>
  );
}