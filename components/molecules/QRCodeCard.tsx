"use client";
import { Button }  from "@/components/atoms/Button";
import { QRCode }  from "@/components/atoms/QRCode";
import { useRef }  from "react";
import { FiDownload, FiPrinter } from "react-icons/fi";

interface QRCodeCardProps {
  value:        string;
  productName?: string;
  productCode?: string;
  size?:        number;
}

export function QRCodeCard({
  value,
  productName,
  productCode,
  size = 180,
}: QRCodeCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleCanvasReady = (canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const a      = document.createElement("a");
    a.download   = `qr-${value}.png`;
    a.href       = canvasRef.current.toDataURL("image/png");
    a.click();
  };

  const handlePrint = () => {
    if (!canvasRef.current) return;
    const img      = canvasRef.current.toDataURL("image/png");
    const win      = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>QR Code — ${productName ?? value}</title>
      <style>
        body { display:flex; flex-direction:column; align-items:center; justify-content:center;
               min-height:100vh; margin:0; font-family:sans-serif; }
        img { max-width:300px; }
        p { margin:8px 0 0; font-size:14px; color:#333; }
        small { color:#666; font-size:11px; font-family:monospace; }
      </style></head><body>
      <img src="${img}" />
      ${productName ? `<p>${productName}</p>` : ""}
      ${productCode ? `<small>${productCode}</small>` : ""}
      </body></html>
    `);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); win.close(); }, 250);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-2">
      {/* QR Code */}
      <div className="p-3 bg-white dark:bg-white rounded-2xl shadow-inner border border-gray-100">
        <QRCode value={value} size={size} onReady={handleCanvasReady} />
      </div>

      {/* Info */}
      {productName && (
        <div className="text-center">
          <p className="font-semibold text-sm text-gray-900 dark:text-white">
            {productName}
          </p>
          {productCode && (
            <p className="text-xs text-gray-400 font-mono mt-0.5">{productCode}</p>
          )}
        </div>
      )}

      {/* Value kode */}
      <div className="bg-gray-100 dark:bg-slate-700 rounded-lg px-3 py-1.5">
        <code className="text-xs text-gray-600 dark:text-gray-300 font-mono">
          {value}
        </code>
      </div>

      {/* Aksi */}
      <div className="flex gap-2 w-full">
        <Button
          variant="outline" size="sm" fullWidth
          leftIcon={<FiDownload size={14} />}
          onClick={handleDownload}
        >
          Unduh
        </Button>
        <Button
          variant="secondary" size="sm" fullWidth
          leftIcon={<FiPrinter size={14} />}
          onClick={handlePrint}
        >
          Print
        </Button>
      </div>
    </div>
  );
}