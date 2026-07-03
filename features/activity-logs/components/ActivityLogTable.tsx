"use client";
import { Badge }             from "@/components/atoms/Badge";
import { Avatar }            from "@/components/atoms/Avatar";
import { Button }            from "@/components/atoms/Button";
import { DataTable, Column } from "@/components/organisms/DataTable";
import { ActivityLog, PaginationMeta } from "@/types";
import { FiInfo } from "react-icons/fi";

type BadgeVariant = "green" | "blue" | "red" | "amber" | "gray";

const ACTION_BADGE: Record<string, BadgeVariant> = {
  LOGIN: "green", REGISTER: "green", GOOGLE_LOGIN: "green", PAYMENT: "green",
  CREATE: "blue", EXPORT: "blue",
  UPDATE: "amber",
  DELETE: "red",
  LOGOUT: "gray",
};

interface Props {
  logs: ActivityLog[];
  loading: boolean;
  meta: PaginationMeta | null;
  onViewDetail: (log: ActivityLog) => void;
  onPageChange: (page: number) => void;
}

export function ActivityLogTable({ logs, loading, meta, onViewDetail, onPageChange }: Props) {
  const columns: Column<ActivityLog>[] = [
    {
      key: "time", header: "Waktu",
      render: (log) => (
        <div className="whitespace-nowrap">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {new Date(log.created_at).toLocaleDateString("id-ID", {
              day: "2-digit", month: "short", year: "numeric",
            })}
          </p>
          <p className="text-xs text-gray-400">
            {new Date(log.created_at).toLocaleTimeString("id-ID", {
              hour: "2-digit", minute: "2-digit", second: "2-digit",
            })}
          </p>
        </div>
      ),
    },
    {
      key: "user", header: "User",
      render: (log) => (
        <div className="flex items-center gap-2">
          <Avatar name={log.user?.name} size="sm" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-900 dark:text-white truncate max-w-32">
              {log.user?.name ?? <span className="text-gray-400 italic">System</span>}
            </p>
            <p className="text-xs text-gray-400 truncate max-w-32">{log.user?.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "action", header: "Aksi",
      render: (log) => (
        <Badge variant={ACTION_BADGE[log.action] ?? "gray"}>{log.action}</Badge>
      ),
    },
    {
      key: "description", header: "Deskripsi",
      render: (log) => (
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm truncate">
            {log.description}
          </p>
          {log.subject_type && (
            <p className="text-xs text-gray-400 mt-0.5">
              {log.subject_type} #{log.subject_id}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "ip", header: "IP Address",
      render: (log) => (
        <code className="text-xs text-gray-400">{log.ip_address ?? "-"}</code>
      ),
    },
    {
      key: "detail", header: "",
      render: (log) =>
        (log.old_values || log.new_values) ? (
          <Button
            variant="ghost" size="xs"
            leftIcon={<FiInfo size={13} />}
            onClick={() => onViewDetail(log)}
          >
            Detail
          </Button>
        ) : null,
    },
  ];

  return (
    <DataTable
      columns={columns} data={logs} keyExtractor={(log) => log.id}
      loading={loading} emptyMessage="Belum ada activity log."
      meta={meta} onPageChange={onPageChange}
    />
  );
}