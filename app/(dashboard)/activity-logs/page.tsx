"use client";
import Pagination from "@/components/ui/Pagination";
import Modal from "@/components/ui/Modal";
import { activityApi } from "@/lib/api";
import { ActivityLog, PaginationMeta } from "@/types";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

const ACTION_BADGE: Record<string, string> = {
  LOGIN:        "badge-green",
  LOGOUT:       "badge-gray",
  REGISTER:     "badge-green",
  GOOGLE_LOGIN: "badge-blue",
  CREATE:       "badge-blue",
  UPDATE:       "badge-amber",
  DELETE:       "badge-red",
  EXPORT:       "badge-blue",
  PAYMENT:      "badge-green",
};

export default function ActivityLogsPage() {
  const [logs,    setLogs]    = useState<ActivityLog[]>([]);
  const [meta,    setMeta]    = useState<PaginationMeta | null>(null);
  const [search,  setSearch]  = useState("");
  const [action,  setAction]  = useState("");
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(true);
  const [detail,  setDetail]  = useState<ActivityLog | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await activityApi.list({
        search:  search || undefined,
        action:  action || undefined,
        page,
        per_page: 20,
      });
      setLogs(data.data);
      setMeta(data.meta);
    } catch {
      toast.error("Gagal memuat activity log");
    } finally {
      setLoading(false);
    }
  }, [search, action, page]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchData]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="page-title">Activity Log & Audit Trail</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Riwayat semua aktivitas pengguna di sistem
        </p>
      </div>

      {/* Tabel */}
      <div className="card">
        {/* Filter */}
        <div className="flex flex-wrap gap-3 mb-5">
          <input
            className="input flex-1 min-w-48"
            placeholder="Cari deskripsi aktivitas..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <select
            className="input w-44"
            value={action}
            onChange={(e) => { setAction(e.target.value); setPage(1); }}
          >
            <option value="">Semua Aksi</option>
            {[
              "LOGIN","LOGOUT","REGISTER","GOOGLE_LOGIN",
              "CREATE","UPDATE","DELETE","EXPORT","PAYMENT",
            ].map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="th">Waktu</th>
                <th className="th">User</th>
                <th className="th">Aksi</th>
                <th className="th">Deskripsi</th>
                <th className="th">IP Address</th>
                <th className="th"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                      Memuat...
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-400 text-sm">
                    Belum ada activity log
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="tr">
                    {/* Waktu */}
                    <td className="td">
                      <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleDateString("id-ID", {
                          day:   "2-digit",
                          month: "short",
                          year:  "numeric",
                        })}
                      </p>
                      <p className="text-xs text-gray-400 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleTimeString("id-ID", {
                          hour:   "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </p>
                    </td>

                    {/* User */}
                    <td className="td">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {log.user?.name ?? (
                          <span className="text-gray-400 italic">System</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400 truncate max-w-32">
                        {log.user?.email ?? ""}
                      </p>
                    </td>

                    {/* Aksi */}
                    <td className="td">
                      <span className={ACTION_BADGE[log.action] ?? "badge-gray"}>
                        {log.action}
                      </span>
                    </td>

                    {/* Deskripsi */}
                    <td className="td">
                      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                        {log.description}
                      </p>
                      {log.subject_type && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {log.subject_type} #{log.subject_id}
                        </p>
                      )}
                    </td>

                    {/* IP */}
                    <td className="td">
                      <code className="text-xs text-gray-400">
                        {log.ip_address ?? "-"}
                      </code>
                    </td>

                    {/* Tombol detail audit trail */}
                    <td className="td">
                      {(log.old_values || log.new_values) && (
                        <button
                          onClick={() => setDetail(log)}
                          className="text-xs text-blue-600 hover:underline font-medium"
                        >
                          Detail
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {meta && (
          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            total={meta.total}
            perPage={20}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Modal Audit Trail Detail */}
      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title="Audit Trail — Detail Perubahan"
        size="lg"
      >
        {detail && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 text-sm">
              <div>
                <span className="text-gray-400">Aksi:</span>{" "}
                <span className={`${ACTION_BADGE[detail.action] ?? "badge-gray"} ml-1`}>
                  {detail.action}
                </span>
              </div>
              <div>
                <span className="text-gray-400">User:</span>{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {detail.user?.name ?? "System"}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Waktu:</span>{" "}
                <span className="text-gray-600 dark:text-gray-300">
                  {new Date(detail.created_at).toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-700 rounded-lg px-3 py-2">
              {detail.description}
            </p>

            <div className="grid grid-cols-2 gap-4">
              {/* Nilai Lama */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Nilai Sebelum
                </p>
                {detail.old_values ? (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-xs font-mono overflow-auto max-h-64">
                    <pre className="text-red-800 dark:text-red-300 whitespace-pre-wrap break-all">
                      {JSON.stringify(detail.old_values, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 text-xs text-gray-400 text-center">
                    Tidak ada data sebelumnya
                  </div>
                )}
              </div>

              {/* Nilai Baru */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Nilai Sesudah
                </p>
                {detail.new_values ? (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-xs font-mono overflow-auto max-h-64">
                    <pre className="text-green-800 dark:text-green-300 whitespace-pre-wrap break-all">
                      {JSON.stringify(detail.new_values, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 text-xs text-gray-400 text-center">
                    Tidak ada data baru
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}