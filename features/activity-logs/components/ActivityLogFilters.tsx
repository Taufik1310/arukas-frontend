"use client";
import { SearchInput } from "@/components/molecules/SearchInput";

const ACTIONS = [
  "LOGIN", "LOGOUT", "REGISTER", "GOOGLE_LOGIN",
  "CREATE", "UPDATE", "DELETE", "EXPORT", "PAYMENT",
];

interface Props {
  search: string;
  actionFilter: string;
  onSearchChange: (v: string) => void;
  onActionChange: (v: string) => void;
}

export function ActivityLogFilters({ search, actionFilter, onSearchChange, onActionChange }: Props) {
  return (
    <div className="flex flex-wrap gap-3 mb-5">
      <SearchInput
        value={search} onChange={onSearchChange}
        placeholder="Cari deskripsi aktivitas..."
        className="flex-1 min-w-48"
      />
      <select
        className="input w-44"
        value={actionFilter}
        onChange={(e) => onActionChange(e.target.value)}
      >
        <option value="">Semua Aksi</option>
        {ACTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
      </select>
    </div>
  );
}