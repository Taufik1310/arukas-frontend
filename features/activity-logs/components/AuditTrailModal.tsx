"use client";
import { Badge }        from "@/components/atoms/Badge";
import Modal            from "@/components/organisms/Modal";
import { ActivityLog }  from "@/types";

type BadgeVariant = "green" | "blue" | "red" | "amber" | "gray";

const ACTION_BADGE: Record<string, BadgeVariant> = {
  LOGIN: "green", REGISTER: "green", GOOGLE_LOGIN: "green", PAYMENT: "green",
  CREATE: "blue", EXPORT: "blue",
  UPDATE: "amber",
  DELETE: "red",
  LOGOUT: "gray",
};

interface Props {
  log: ActivityLog | null;
  onClose: () => void;
}

export function AuditTrailModal({ log, onClose }: Props) {
  return (
    <Modal
      open={!!log} onClose={onClose}
      title="Audit Trail — Detail Perubahan" size="lg"
    >
      {log && (
        <div className="space-y-4">
          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-sm bg-gray-50 dark:bg-slate-700 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Aksi:</span>
              <Badge variant={ACTION_BADGE[log.action] ?? "gray"}>{log.action}</Badge>
            </div>
            <div>
              <span className="text-gray-400">User: </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {log.user?.name ?? "System"}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Waktu: </span>
              <span className="text-gray-600 dark:text-gray-300">
                {new Date(log.created_at).toLocaleString("id-ID")}
              </span>
            </div>
            {log.ip_address && (
              <div>
                <span className="text-gray-400">IP: </span>
                <code className="text-xs text-gray-500 dark:text-gray-400">{log.ip_address}</code>
              </div>
            )}
          </div>

          {/* Deskripsi */}
          <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-700 rounded-lg px-3 py-2.5">
            {log.description}
          </p>

          {/* Nilai Lama vs Baru */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Nilai Sebelum
              </p>
              {log.old_values ? (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 max-h-60 overflow-auto">
                  <pre className="text-xs text-red-800 dark:text-red-300 whitespace-pre-wrap break-all font-mono">
                    {JSON.stringify(log.old_values, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 text-xs text-gray-400 text-center h-16 flex items-center justify-center">
                  Tidak ada data sebelumnya
                </div>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Nilai Sesudah
              </p>
              {log.new_values ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 max-h-60 overflow-auto">
                  <pre className="text-xs text-green-800 dark:text-green-300 whitespace-pre-wrap break-all font-mono">
                    {JSON.stringify(log.new_values, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 text-xs text-gray-400 text-center h-16 flex items-center justify-center">
                  Tidak ada data baru
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}