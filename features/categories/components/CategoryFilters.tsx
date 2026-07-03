import { SearchInput } from "@/components/molecules/SearchInput";

interface Props { search: string; onSearchChange: (v: string) => void; }

export function CategoryFilters({ search, onSearchChange }: Props) {
  return (
    <div className="mb-5">
      <SearchInput
        value={search} onChange={onSearchChange}
        placeholder="Cari nama kategori..." className="max-w-xs"
      />
    </div>
  );
}