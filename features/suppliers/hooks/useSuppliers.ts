"use client";
import { supplierApi } from "@/lib/api";
import { PaginationMeta, Supplier } from "@/types";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

export type SupplierFormState = {
  name: string; email: string; phone: string;
  address: string; city: string; notes: string;
  is_active: boolean;
};

const INITIAL: SupplierFormState = {
  name: "", email: "", phone: "",
  address: "", city: "", notes: "",
  is_active: true,
};

type ApiError = {
  response?: { data?: { message?: string; errors?: Record<string, string[]> } };
};

export function useSuppliers() {
  const [data,    setData]    = useState<Supplier[]>([]);
  const [meta,    setMeta]    = useState<PaginationMeta | null>(null);
  const [search,  setSearch]  = useState("");
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState<SupplierFormState>(INITIAL);
  const [editing, setEditing] = useState<number | null>(null);
  const [saving,  setSaving]  = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: r } = await supplierApi.list({ search, page });
      setData(r.data); setMeta(r.meta);
    } catch { toast.error("Gagal memuat supplier"); }
    finally  { setLoading(false); }
  }, [search, page]);

  useEffect(() => {
    void Promise.resolve().then(fetchData);
  }, [fetchData]);

  const handleSearchChange = (v: string) => { setSearch(v); setPage(1); };

  const openAdd = () => { setForm(INITIAL); setEditing(null); setModal(true); };
  const openEdit = (s: Supplier) => {
    setForm({
      name: s.name, email: s.email ?? "", phone: s.phone,
      address: s.address ?? "", city: s.city ?? "",
      notes: s.notes ?? "", is_active: s.is_active,
    });
    setEditing(s.id); setModal(true);
  };
  const closeModal = () => setModal(false);

  const updateForm = (key: keyof SupplierFormState, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form };
      if (editing) { await supplierApi.update(editing, payload); toast.success("Supplier diperbarui"); }
      else         { await supplierApi.store(payload);           toast.success("Supplier ditambahkan"); }
      closeModal(); fetchData();
    } catch (err: unknown) {
      const e      = err as ApiError;
      const errors = e.response?.data?.errors;
      if (errors) Object.values(errors).flat().forEach((m) => toast.error(m));
      else toast.error(e.response?.data?.message ?? "Gagal menyimpan");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus supplier "${name}"?`)) return;
    try { await supplierApi.delete(id); toast.success("Supplier dihapus"); fetchData(); }
    catch (err: unknown) {
      toast.error((err as ApiError).response?.data?.message ?? "Gagal menghapus");
    }
  };

  return {
    data, meta, search, page, loading,
    modal, form, editing, saving,
    handleSearchChange, setPage,
    openAdd, openEdit, closeModal, updateForm,
    handleSubmit, handleDelete,
  };
}