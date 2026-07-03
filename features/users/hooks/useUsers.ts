"use client";
import { useAuth } from "@/context/AuthContext";
import { userApi } from "@/lib/api";
import { PaginationMeta, User } from "@/types";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

export type UserFormState = {
  name:                  string;
  email:                 string;
  password:              string;
  password_confirmation: string;
  role:                  "admin" | "petugas";
  phone:                 string;
  is_active:             boolean;
};

const INITIAL: UserFormState = {
  name: "", email: "", password: "",
  password_confirmation: "", role: "petugas",
  phone: "", is_active: true,
};

type ApiError = {
  response?: { data?: { message?: string; errors?: Record<string, string[]> } };
};

export function useUsers() {
  const { user: currentUser, isAdmin } = useAuth();

  const [data,    setData]    = useState<User[]>([]);
  const [meta,    setMeta]    = useState<PaginationMeta | null>(null);
  const [search,  setSearch]  = useState("");
  const [roleFilter, setRole] = useState("");
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState<UserFormState>(INITIAL);
  const [editing, setEditing] = useState<number | null>(null);
  const [saving,  setSaving]  = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: r } = await userApi.list({
        search: search     || undefined,
        role:   roleFilter || undefined,
        page,
      });
      setData(r.data); setMeta(r.meta);
    } catch { toast.error("Gagal memuat data user"); }
    finally  { setLoading(false); }
  }, [search, roleFilter, page]);

  useEffect(() => {
    void Promise.resolve().then(fetchData);
  }, [fetchData]);

  const handleSearchChange = (v: string) => { setSearch(v); setPage(1); };
  const handleRoleChange   = (v: string) => { setRole(v);   setPage(1); };

  const openAdd = () => { setForm(INITIAL); setEditing(null); setModal(true); };
  const openEdit = (u: User) => {
    setForm({
      name:                  u.name,
      email:                 u.email,
      password:              "",
      password_confirmation: "",
      role:                  u.role,
      phone:                 u.phone ?? "",
      is_active:             u.is_active,
    });
    setEditing(u.id); setModal(true);
  };
  const closeModal = () => setModal(false);

  const updateForm = (key: keyof UserFormState, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing && form.password !== form.password_confirmation) {
      toast.error("Konfirmasi password tidak sama"); return;
    }
    if (editing && form.password && form.password !== form.password_confirmation) {
      toast.error("Konfirmasi password tidak sama"); return;
    }
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        name: form.name, email: form.email,
        role: form.role, phone: form.phone,
        is_active: form.is_active,
      };
      if (form.password) {
        payload.password              = form.password;
        payload.password_confirmation = form.password_confirmation;
      }
      if (editing) { await userApi.update(editing, payload); toast.success("User diperbarui"); }
      else         { await userApi.store(payload);           toast.success("User ditambahkan"); }
      closeModal(); fetchData();
    } catch (err: unknown) {
      const e      = err as ApiError;
      const errors = e.response?.data?.errors;
      if (errors) Object.values(errors).flat().forEach((m) => toast.error(m));
      else toast.error(e.response?.data?.message ?? "Gagal menyimpan");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (id === currentUser?.id) { toast.error("Tidak bisa menghapus akun sendiri"); return; }
    if (!confirm(`Hapus user "${name}"?\nAksi ini tidak dapat dibatalkan.`)) return;
    try { await userApi.delete(id); toast.success("User dihapus"); fetchData(); }
    catch (err: unknown) {
      toast.error((err as ApiError).response?.data?.message ?? "Gagal menghapus");
    }
  };

  return {
    data, meta, search, roleFilter, page, loading,
    modal, form, editing, saving,
    isAdmin, currentUserId: currentUser?.id,
    handleSearchChange, handleRoleChange, setPage,
    openAdd, openEdit, closeModal, updateForm,
    handleSubmit, handleDelete,
  };
}