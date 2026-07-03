"use client";
import { categoryApi } from "@/lib/api";
import { Category, PaginationMeta } from "@/types";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

export type CategoryFormState = {
  name: string;
  description: string;
  is_active: boolean;
};

const INITIAL: CategoryFormState = { name: "", description: "", is_active: true };

type ApiError = {
  response?: { data?: { message?: string; errors?: Record<string, string[]> } };
};

export function useCategories() {
  const [data,    setData]    = useState<Category[]>([]);
  const [meta,    setMeta]    = useState<PaginationMeta | null>(null);
  const [search,  setSearch]  = useState("");
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState<CategoryFormState>(INITIAL);
  const [editing, setEditing] = useState<number | null>(null);
  const [saving,  setSaving]  = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: r } = await categoryApi.list({ search, page });
      setData(r.data); setMeta(r.meta);
    } catch { toast.error("Gagal memuat kategori"); }
    finally  { setLoading(false); }
  }, [search, page]);

  useEffect(() => {
    void Promise.resolve().then(fetchData);
  }, [fetchData]);

  const handleSearchChange = (v: string) => { setSearch(v); setPage(1); };

  const openAdd = () => { setForm(INITIAL); setEditing(null); setModal(true); };
  const openEdit = (c: Category) => {
    setForm({ name: c.name, description: c.description ?? "", is_active: c.is_active });
    setEditing(c.id); setModal(true);
  };
  const closeModal = () => setModal(false);

  const updateForm = (key: keyof CategoryFormState, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name",        form.name);
      fd.append("description", form.description);
      fd.append("is_active",   form.is_active ? "1" : "0");
      if (editing) { await categoryApi.update(editing, fd); toast.success("Kategori diperbarui"); }
      else         { await categoryApi.store(fd);           toast.success("Kategori ditambahkan"); }
      closeModal(); fetchData();
    } catch (err: unknown) {
      const e      = err as ApiError;
      const errors = e.response?.data?.errors;
      if (errors) Object.values(errors).flat().forEach((m) => toast.error(m));
      else toast.error(e.response?.data?.message ?? "Gagal menyimpan");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus kategori "${name}"?`)) return;
    try { await categoryApi.delete(id); toast.success("Kategori dihapus"); fetchData(); }
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