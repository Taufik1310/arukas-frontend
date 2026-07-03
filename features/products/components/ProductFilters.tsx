"use client";
import { Button } from "@/components/atoms/Button";
import { SearchInput } from "@/components/molecules/SearchInput";
import { Category } from "@/types";
import { FiCamera } from "react-icons/fi";

interface Props {
  search: string;
  catFilter: string;
  categories: Category[];
  onSearchChange: (v: string) => void;
  onCatChange: (v: string) => void;
  onScan: () => void;
}

export function ProductFilters({ search, catFilter, categories, onSearchChange, onCatChange, onScan }: Props) {
  return (
    <div className="flex flex-wrap gap-3 mb-5">
      <SearchInput
        value={search} onChange={onSearchChange}
        placeholder="Cari nama, kode, barcode..."
        className="flex-1 min-w-48"
      />
      <select
        className="input w-48"
        value={catFilter}
        onChange={(e) => onCatChange(e.target.value)}
      >
        <option value="">Semua Kategori</option>
        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <Button variant="secondary" size="sm" leftIcon={<FiCamera size={14} />} onClick={onScan}>
        Scan Barcode
      </Button>
    </div>
  );
}