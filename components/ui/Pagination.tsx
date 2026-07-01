"use client";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage?: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  lastPage,
  total,
  perPage = 10,
  onPageChange,
}: PaginationProps) {
  if (lastPage <= 1) return null;

  // Buat range angka halaman dengan elipsis
  const getPages = (): (number | "...")[] => {
    const delta = 1;
    const range: (number | "...")[] = [];
    const left  = Math.max(2, currentPage - delta);
    const right = Math.min(lastPage - 1, currentPage + delta);

    range.push(1);
    if (left > 2) range.push("...");
    for (let i = left; i <= right; i++) range.push(i);
    if (right < lastPage - 1) range.push("...");
    if (lastPage > 1) range.push(lastPage);

    return range;
  };

  const from = (currentPage - 1) * perPage + 1;
  const to   = Math.min(currentPage * perPage, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Menampilkan{" "}
        <span className="font-medium">{from}–{to}</span> dari{" "}
        <span className="font-medium">{total}</span> data
      </p>

      <div className="flex items-center gap-1">
        {/* Tombol Sebelumnya */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-slate-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm"
        >
          ‹
        </button>

        {/* Angka Halaman */}
        {getPages().map((p, i) =>
          p === "..." ? (
            <span
              key={`dot-${i}`}
              className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors ${
                p === currentPage
                  ? "bg-blue-600 text-white font-medium"
                  : "border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* Tombol Berikutnya */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-slate-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm"
        >
          ›
        </button>
      </div>
    </div>
  );
}