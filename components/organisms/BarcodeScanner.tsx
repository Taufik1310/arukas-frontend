"use client";
import { Button }  from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { cn }      from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiCamera, FiCameraOff, FiX, FiZap } from "react-icons/fi";

interface BarcodeScannerProps {
  onDetected:  (code: string) => void;
  onClose:     () => void;
  className?:  string;
}

type ScannerState = "idle" | "requesting" | "active" | "error";

export default function BarcodeScanner({
  onDetected, onClose, className,
}: BarcodeScannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state,      setState]  = useState<ScannerState>("idle");
  const [errorMsg,   setError]  = useState("");
  const [manualCode, setManual] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quaggaRef = useRef<any>(null);
  const initializedRef = useRef(false);
  const lastCodeRef = useRef("");

  // ── Start Scanner ──────────────────────────────────────────────────────
  const startScanner = useCallback(async () => {
    if (!containerRef.current) return;
    setState("requesting");

    try {
      // Cek permission kamera
      await navigator.mediaDevices.getUserMedia({ video: true });

      const { default: Quagga } = await import("quagga");
      quaggaRef.current = Quagga;

      Quagga.init(
        {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: containerRef.current,
            constraints: {
              facingMode: "environment",
              width:      { min: 640, ideal: 1280 },
              height:     { min: 480, ideal: 720  },
            },
          },
          decoder: {
            readers: [
              "ean_reader",
              "ean_8_reader",
              "code_128_reader",
              "code_39_reader",
              "upc_reader",
              "upc_e_reader",
            ],
            debug: { showCanvas: false, showPatches: false },
          },
          locator: {
            patchSize:   "medium",
            halfSample:  true,
          },
          frequency: 10,
          locate:    true,
        },
        (err: Error | null) => {
          if (err) {
            setState("error");
            setError("Gagal mengakses kamera. Pastikan izin kamera sudah diberikan.");
            return;
          }
          Quagga.start();
          setState("active");
        }
      );

      // Deteksi barcode
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Quagga.onDetected((result: any) => {
        const code = result?.codeResult?.code;
        if (!code || code === lastCodeRef.current) return;
        lastCodeRef.current = code;

        // Delay kecil untuk hindari duplikat scan
        setTimeout(() => {
          try { Quagga.stop(); } catch { /**/ }
          onDetected(code);
        }, 300);
      });
    } catch (err: unknown) {
      setState("error");
      const msg = err instanceof Error ? err.message : "Kamera tidak tersedia";
      if (msg.includes("Permission") || msg.includes("NotAllowed")) {
        setError("Izin kamera ditolak. Buka pengaturan browser dan izinkan akses kamera.");
      } else {
        setError("Tidak dapat mengakses kamera: " + msg);
      }
    }
  }, [onDetected]);

  // ── Stop Scanner ───────────────────────────────────────────────────────
  const stopScanner = useCallback(() => {
    if (quaggaRef.current) {
      try { quaggaRef.current.stop(); } catch { /**/ }
      quaggaRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      startScanner();
    }
    return () => stopScanner();
  }, [startScanner, stopScanner]);

  // ── Manual input ───────────────────────────────────────────────────────
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = manualCode.trim();
    if (!trimmed) return;
    stopScanner();
    onDetected(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={cn(
        "w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-2xl",
        className,
      )}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <FiCamera size={16} className="text-blue-600" />
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
              Scan Barcode
            </h3>
          </div>
          <button
            onClick={() => { stopScanner(); onClose(); }}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Camera Viewport */}
        <div className="relative bg-black">
          <div
            ref={containerRef}
            className="relative w-full overflow-hidden"
            style={{ height: 240 }}
          >
            {/* Quagga akan inject video dan canvas ke sini */}
          </div>

          {/* Overlay scan line */}
          {state === "active" && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              {/* Frame */}
              <div className="relative w-56 h-32">
                {/* Corners */}
                {["top-0 left-0 border-t-2 border-l-2",
                  "top-0 right-0 border-t-2 border-r-2",
                  "bottom-0 left-0 border-b-2 border-l-2",
                  "bottom-0 right-0 border-b-2 border-r-2",
                ].map((cls, i) => (
                  <div
                    key={i}
                    className={`absolute w-5 h-5 border-blue-400 ${cls}`}
                  />
                ))}
                {/* Scan line animation */}
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-blue-400/70 animate-pulse" />
              </div>
            </div>
          )}

          {/* Loading state */}
          {state === "requesting" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 gap-3">
              <Spinner size="lg" className="text-blue-400" />
              <p className="text-white text-sm">Mengakses kamera...</p>
            </div>
          )}

          {/* Error state */}
          {state === "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 gap-3 p-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <FiCameraOff size={20} className="text-red-400" />
              </div>
              <p className="text-red-400 text-xs text-center leading-relaxed">{errorMsg}</p>
              <Button size="xs" variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={startScanner}>
                Coba Lagi
              </Button>
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className="px-4 py-2 bg-gray-900 flex items-center gap-2">
          {state === "active" ? (
            <>
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
              <p className="text-xs text-gray-300">Arahkan kamera ke barcode produk</p>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-yellow-400 shrink-0" />
              <p className="text-xs text-gray-300">
                {state === "requesting" ? "Memulai kamera..." : "Kamera tidak aktif"}
              </p>
            </>
          )}
        </div>

        {/* Manual Input Fallback */}
        <div className="px-4 py-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-gray-200 dark:bg-slate-600" />
            <span className="text-xs text-gray-400">atau ketik manual</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-slate-600" />
          </div>

          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              className="input text-sm flex-1"
              placeholder="Ketik kode barcode..."
              value={manualCode}
              onChange={(e) => setManual(e.target.value)}
              autoComplete="off"
            />
            <Button
              type="submit"
              size="sm"
              leftIcon={<FiZap size={13} />}
              disabled={!manualCode.trim()}
            >
              Cari
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
}