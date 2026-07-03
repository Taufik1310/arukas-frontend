"use client";
import { SearchInput } from "@/components/molecules/SearchInput";

interface Props {
  search: string;
  statusFilter: string;
  onSearchChange: (v: string) => void;
  onStatusChange: (v: string) => void;
}

const STATUS_OPTIONS = [
  { value: "",           label: "Semua Status" },
  { value: "draft",      label: "Draft"        },
  { value: "ordered",    label: "Dipesan"      },
  { value: "received",   label: "Diterima"     },
  { value: "cancelled",  label: "Dibatalkan"   },
];

export function PurchaseFilters({ search, statusFilter, onSearchChange, onStatusChange }: Props) {
  return (
    <div className="flex flex-wrap gap-3 mb-5">
      <SearchInput
        value={search} onChange={onSearchChange}
        placeholder="Cari kode PO..." className="flex-1 min-w-48"
      />
      <select
        className="input w-44"
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}