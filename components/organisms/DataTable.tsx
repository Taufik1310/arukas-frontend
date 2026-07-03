"use client";
import { EmptyState } from "@/components/molecules/EmptyState";
import { Spinner } from "@/components/atoms/Spinner";
import Pagination from "./Pagination";
import { PaginationMeta } from "@/types";

export interface Column<T> {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  loading?: boolean;
  emptyMessage?: string;
  meta?: PaginationMeta | null;
  onPageChange?: (page: number) => void;
}

export function DataTable<T>({
  columns, data, keyExtractor,
  loading, emptyMessage, meta, onPageChange,
}: DataTableProps<T>) {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-slate-700">
              {columns.map((col) => (
                <th key={col.key}
                  className={`text-${col.align ?? "left"} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-3 pr-4`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                    <Spinner size="md" /> Memuat data...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <EmptyState message={emptyMessage} colSpan={columns.length} />
            ) : (
              data.map((row) => (
                <tr key={keyExtractor(row)}
                  className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/40 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key}
                      className={`py-3 pr-4 text-sm text-gray-600 dark:text-gray-300 text-${col.align ?? "left"}`}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {meta && onPageChange && (
        <Pagination
          currentPage={meta.current_page} lastPage={meta.last_page}
          total={meta.total} onPageChange={onPageChange}
        />
      )}
    </>
  );
}