"use client";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";
import { useAuth } from "@/context/AuthContext";
import { userApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { PaginationMeta, User } from "@/types";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

type FormState = {
  name:                  string;
  email:                 string;
  password:              string;
  password_confirmation: string;
  role:                  "admin" | "petugas";
  phone:                 string;
  is_active:             boolean;
};

const INITIAL: FormState = {
  name:                  "",
  email:                 "",
  password:              "",
  password_confirmation: "",
  role:                  "petugas",
  phone:                 "",
  is_active:             true,
};

export default function UsersPage() {
  const { isAdmin, user: currentUser } = useAuth();

  const [data,    setData]    = useState<User[]>([]);
  const [meta,    setMeta]    = useState<PaginationMeta | null>(null);
  const [search,  setSearch]  = useState("");
  const [role,    setRole]    = useState("");
  const [page,    setPage]    = useState(1);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState<FormState>(INITIAL);
  const [editing, setEditing] = useState<number | null>(null);
  const [saving,  setSaving]  = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: r } = await userApi.list({
        search: search || undefined,
        role:   role   || undefined,
        page,
      });
      setData(r.data);
      setMeta(r.meta);
    } catch {
      toast.error("Gagal memuat data user");
    } finally {
      setLoading(false);
    }
  }, [search, role, page]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchData]);

  // Jika bukan admin, tolak akses
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <span className="text-5xl">⛔</span>
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Akses Ditolak
        </h2>
        <p className="text-sm text-gray-400">
          Halaman ini hanya dapat diakses oleh Admin.
        </p>
      </div>
    );
  }

  const ch =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const openAdd = () => {
    setForm(INITIAL);
    setEditing(null);
    setModal(true);
  };

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
    setEditing(u.id);
    setModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi password saat tambah user baru
    if (!editing && form.password !== form.password_confirmation) {
      toast.error("Konfirmasi password tidak sama");
      return;
    }
    // Validasi password saat edit (jika diisi)
    if (editing && form.password && form.password !== form.password_confirmation) {
      toast.error("Konfirmasi password tidak sama");
      return;
    }

    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        name:      form.name,
        email:     form.email,
        role:      form.role,
        phone:     form.phone,
        is_active: form.is_active,
      };

      // Sertakan password hanya jika diisi
      if (form.password) {
        payload.password              = form.password;
        payload.password_confirmation = form.password_confirmation;
      }

      if (editing) {
        await userApi.update(editing, payload);
        toast.success("User berhasil diperbarui");
      } else {
        await userApi.store(payload);
        toast.success("User berhasil ditambahkan");
      }
      setModal(false);
      fetchData();
    } catch (err: unknown) {
      const errors = (
        err as { response?: { data?: { errors?: Record<string, string[]> } } }
      )?.response?.data?.errors;
      if (errors) {
        Object.values(errors).flat().forEach((m) => toast.error(m));
      } else {
        toast.error("Gagal menyimpan user");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (id === currentUser?.id) {
      toast.error("Tidak bisa menghapus akun sendiri");
      return;
    }
    if (!confirm(`Hapus user "${name}"?\nAksi ini tidak dapat dibatalkan.`))
      return;
    try {
      await userApi.delete(id);
      toast.success("User berhasil dihapus");
      fetchData();
    } catch (err: unknown) {
      toast.error(
        (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ?? "Gagal menghapus user"
      );
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Manajemen User</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Kelola akun pengguna dan hak akses
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          + Tambah User
        </button>
      </div>

      {/* Tabel */}
      <div className="card">
        {/* Filter */}
        <div className="flex flex-wrap gap-3 mb-5">
          <input
            className="input flex-1 min-w-48"
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <select
            className="input w-40"
            value={role}
            onChange={(e) => { setRole(e.target.value); setPage(1); }}
          >
            <option value="">Semua Role</option>
            <option value="admin">Admin</option>
            <option value="petugas">Petugas</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="th">User</th>
                <th className="th">Role</th>
                <th className="th">Telepon</th>
                <th className="th">Status</th>
                <th className="th">Bergabung</th>
                <th className="th">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                      Memuat...
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-400 text-sm">
                    {search || role
                      ? "User tidak ditemukan"
                      : "Belum ada user."}
                  </td>
                </tr>
              ) : (
                data.map((u) => (
                  <tr key={u.id} className="tr">
                    {/* Avatar + Nama */}
                    <td className="td">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                            {u.name[0]?.toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                            {u.name}
                            {u.id === currentUser?.id && (
                              <span className="ml-2 text-xs text-blue-500">
                                (Anda)
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-400 truncate max-w-44">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="td">
                      <span
                        className={
                          u.role === "admin" ? "badge-red" : "badge-blue"
                        }
                      >
                        {u.role}
                      </span>
                    </td>

                    {/* Telepon */}
                    <td className="td text-gray-500 dark:text-gray-400">
                      {u.phone ?? "-"}
                    </td>

                    {/* Status */}
                    <td className="td">
                      <span className={u.is_active ? "badge-green" : "badge-gray"}>
                        {u.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>

                    {/* Tanggal bergabung */}
                    <td className="td text-xs text-gray-400">
                      {formatDate(u.created_at)}
                    </td>

                    {/* Aksi */}
                    <td className="td">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openEdit(u)}
                          className="text-blue-600 hover:underline text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(u.id, u.name)}
                          disabled={u.id === currentUser?.id}
                          className="text-red-500 hover:underline text-xs font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {meta && (
          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            total={meta.total}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Modal Form */}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editing ? "Edit User" : "Tambah User Baru"}
        footer={
          <>
            <button
              type="button"
              onClick={() => setModal(false)}
              className="btn-secondary"
            >
              Batal
            </button>
            <button
              form="user-form"
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </>
        }
      >
        <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Nama Lengkap *</label>
            <input
              className="input"
              value={form.name}
              onChange={ch("name")}
              required
              placeholder="Nama lengkap user"
            />
          </div>
          <div>
            <label className="label">Email *</label>
            <input
              type="email"
              className="input"
              value={form.email}
              onChange={ch("email")}
              required
              placeholder="email@contoh.com"
            />
          </div>
          <div>
            <label className="label">No. Telepon</label>
            <input
              className="input"
              value={form.phone}
              onChange={ch("phone")}
              placeholder="08xxxxxxxxxx"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Role *</label>
              <select className="input" value={form.role} onChange={ch("role")}>
                <option value="petugas">Petugas</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select
                className="input"
                value={form.is_active ? "1" : "0"}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    is_active: e.target.value === "1",
                  }))
                }
              >
                <option value="1">Aktif</option>
                <option value="0">Nonaktif</option>
              </select>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
            <p className="text-xs text-gray-400 mb-3">
              {editing
                ? "Kosongkan password jika tidak ingin mengubahnya."
                : "Password wajib diisi untuk user baru."}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">
                  {editing ? "Password Baru" : "Password *"}
                </label>
                <input
                  type="password"
                  className="input"
                  value={form.password}
                  onChange={ch("password")}
                  required={!editing}
                  minLength={8}
                  placeholder="Min. 8 karakter"
                />
              </div>
              <div>
                <label className="label">Konfirmasi Password</label>
                <input
                  type="password"
                  className="input"
                  value={form.password_confirmation}
                  onChange={ch("password_confirmation")}
                  required={!editing}
                  placeholder="Ulangi password"
                />
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}