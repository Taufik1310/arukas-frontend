"use client";
import { useEffect, useRef } from "react";

interface Props {
  onScan: (code: string) => void;
  onClose: () => void;
}

export default function BarcodeScanner({ onScan, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let Quagga: any;

    // Import dinamis — tidak jalan di server
    import("quagga").then((mod) => {
      Quagga = mod.default;
      Quagga.init(
        {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: ref.current!,
            constraints: {
              facingMode: "environment",
              width: 640,
              height: 480,
            },
          },
          decoder: {
            readers: [
              "ean_reader",
              "code_128_reader",
              "upc_reader",
              "ean_8_reader",
            ],
          },
          locate: true,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err: any) => {
          if (!err) Quagga.start();
        }
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Quagga.onDetected((result: any) => {
        const code = result?.codeResult?.code;
        if (code) {
          onScan(code);
          Quagga.stop();
        }
      });
    });

    return () => {
      if (Quagga) {
        try {
          Quagga.stop();
        } catch {
          // abaikan error saat stop
        }
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 w-80 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
            Scan Barcode Produk
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Area kamera */}
        <div
          ref={ref}
          className="w-full h-56 bg-black rounded-xl overflow-hidden relative"
        >
          {/* Garis bidik merah di tengah */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="border-2 border-red-500 w-44 h-28 rounded opacity-80" />
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-3 mb-3">
          Arahkan kamera ke barcode produk
        </p>

        <button onClick={onClose} className="btn-secondary w-full btn-sm">
          Tutup
        </button>
      </div>
    </div>
  );
}