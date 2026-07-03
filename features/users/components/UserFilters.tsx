"use client";
import { SearchInput } from "@/components/molecules/SearchInput";

interface Props {
  search: string;
  roleFilter: string;
  onSearchChange: (v: string) => void;
  onRoleChange: (v: string) => void;
}

export function UserFilters({ search, roleFilter, onSearchChange, onRoleChange }: Props) {
  return (
    <div className="flex flex-wrap gap-3 mb-5">
      <SearchInput
        value={search} onChange={onSearchChange}
        placeholder="Cari nama atau email..."
        className="flex-1 min-w-48"
      />
      <select
        className="input w-40"
        value={roleFilter}
        onChange={(e) => onRoleChange(e.target.value)}
      >
        <option value="">Semua Role</option>
        <option value="admin">Admin</option>
        <option value="petugas">Petugas</option>
      </select>
    </div>
  );
}