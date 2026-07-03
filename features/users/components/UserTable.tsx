"use client";
import { Avatar }            from "@/components/atoms/Avatar";
import { Badge }             from "@/components/atoms/Badge";
import { Button }            from "@/components/atoms/Button";
import { DataTable, Column } from "@/components/organisms/DataTable";
import { formatDate }        from "@/lib/utils";
import { PaginationMeta, User } from "@/types";
import { FiEdit2, FiTrash2 }    from "react-icons/fi";

interface Props {
  data: User[];
  loading: boolean;
  meta: PaginationMeta | null;
  currentUserId?: number;
  onEdit: (u: User) => void;
  onDelete: (id: number, name: string) => void;
  onPageChange: (page: number) => void;
}

export function UserTable({
  data, loading, meta, currentUserId,
  onEdit, onDelete, onPageChange,
}: Props) {
  const columns: Column<User>[] = [
    {
      key: "user", header: "User",
      render: (u) => (
        <div className="flex items-center gap-3">
          <Avatar name={u.name} src={u.avatar} size="md" />
          <div className="min-w-0">
            <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
              {u.name}
              {u.id === currentUserId && (
                <span className="ml-2 text-xs text-blue-500 font-normal">(Anda)</span>
              )}
            </p>
            <p className="text-xs text-gray-400 truncate max-w-44">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role", header: "Role",
      render: (u) => (
        <Badge variant={u.role === "admin" ? "red" : "blue"}>
          {u.role}
        </Badge>
      ),
    },
    {
      key: "phone", header: "Telepon",
      render: (u) => (
        <span className="text-gray-500 dark:text-gray-400">{u.phone ?? "-"}</span>
      ),
    },
    {
      key: "status", header: "Status",
      render: (u) => (
        <Badge variant={u.is_active ? "green" : "gray"}>
          {u.is_active ? "Aktif" : "Nonaktif"}
        </Badge>
      ),
    },
    {
      key: "joined", header: "Bergabung",
      render: (u) => (
        <span className="text-xs text-gray-400">{formatDate(u.created_at)}</span>
      ),
    },
    {
      key: "actions", header: "Aksi",
      render: (u) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="xs" leftIcon={<FiEdit2 size={13} />} onClick={() => onEdit(u)}>
            Edit
          </Button>
          <Button
            variant="ghost" size="xs" leftIcon={<FiTrash2 size={13} />}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            disabled={u.id === currentUserId}
            onClick={() => onDelete(u.id, u.name)}
          >
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns} data={data} keyExtractor={(u) => u.id}
      loading={loading} emptyMessage="Belum ada user."
      meta={meta} onPageChange={onPageChange}
    />
  );
}