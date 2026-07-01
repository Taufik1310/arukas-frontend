"use client";
import { useEffect, useRef } from "react";

interface Props {
  value: string;
  size?: number;
  productName?: string;
}

export default function QRCodeDisplay({
  value,
  size = 180,
  productName,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;
    import("qrcode").then((QRCode) => {
      QRCode.toCanvas(canvasRef.current!, value, {
        width: size,
        margin: 2,
        color: {
          dark:  "#0F172A",
          light: "#FFFFFF",
        },
      });
    });
  }, [value, size]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.download = `qr-${value}.png`;
    a.href = canvasRef.current.toDataURL();
    a.click();
  };

  return (
    <div className="flex flex-col items-center gap-3 p-4">
      <canvas ref={canvasRef} className="rounded-lg shadow-sm" />
      {productName && (
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 text-center">
          {productName}
        </p>
      )}
      <p className="text-xs text-gray-400 font-mono bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-lg">
        {value}
      </p>
      <button
        onClick={handleDownload}
        className="btn-outline btn-sm w-full"
      >
        ⬇ Unduh QR Code
      </button>
    </div>
  );
}