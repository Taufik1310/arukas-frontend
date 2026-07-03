"use client";
import { SearchInput } from "@/components/molecules/SearchInput";

interface Props { search: string; onSearchChange: (v: string) => void; }

export function SupplierFilters({ search, onSearchChange }: Props) {
  return (
    <div className="mb-5">
      <SearchInput
        value={search} onChange={onSearchChange}
        placeholder="Cari nama, kode, atau telepon..."
        className="max-w-xs"
      />
    </div>
  );
}