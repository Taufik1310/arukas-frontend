"use client";
import { Input } from "@/components/atoms/Input";
import { cn } from "@/lib/utils";
import { FiSearch } from "react-icons/fi";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value, onChange,
  placeholder = "Cari...", className,
}: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <FiSearch
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  );
}