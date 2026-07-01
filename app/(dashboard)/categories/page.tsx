"use client";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";
import { categoryApi } from "@/lib/api";
import { Category, PaginationMeta } from "@/types";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

type FormState = {
  name: string;
  description: string;
  is_active: boolean;
};

const INITIAL: FormState = { name: "", description: "", is_active: true };

export default function CategoriesPage() {
  const [data,    setData]    = useState<Category[]>([]);
  const [meta,    setMeta]    = useState<PaginationMeta | null>(null);
  const [search,  setSearch]  = useState("");
  const [page,    setPage]    = useState(1);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState<FormState>(INITIAL);
  const [editing, setEditing] = useState<number | null>(null);
  const [saving,  setSaving]  = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: r } = await categoryApi.list({ search, page });
      setData(r.data);
      setMeta(r.meta);
    } catch {
      toast.error("Gagal memuat kategori");
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    // call fetchData asynchronously to avoid setting state synchronously inside effect
    (async () => { await fetchData(); })();
  }, [fetchData]);

  const openAdd = () => {
    setForm(INITIAL);
    setEditing(null);
    setModal(true);
  };

  const openEdit = (c: Category) => {
    setForm({
      name:        c.name,
      description: c.description ?? "",
      is_active:   c.is_active,
    });
    setEditing(c.id);
    setModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name",        form.name);
      fd.append("description", form.description);
      fd.append("is_active",   form.is_active ? "1" : "0");

      if (editing) {
        await categoryApi.update(editing, fd);
        toast.success("Kategori berhasil diperbarui");
      } else {
        await categoryApi.store(fd);
        toast.success("Kategori berhasil ditambahkan");
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
        toast.error("Gagal menyimpan kategori");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus kategori "${name}"?`)) return;
    try {
      await categoryApi.delete(id);
      toast.success("Kategori dihapus");
      fetchData();
    } catch (err: unknown) {
      toast.error(
        (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ?? "Gagal menghapus"
      );
    }
  };

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title">Kategori Produk</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Kelola kategori produk toko
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          + Tambah Kategori
        </button>
      </div>

      <div className="card">
        <input
          className="input mb-5 max-w-xs"
          placeholder="Cari kategori..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="th">Nama</th>
                <th className="th">Slug</th>
                <th className="th text-center">Jumlah Produk</th>
                <th className="th">Status</th>
                <th className="th">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                      Memuat...
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-gray-400 text-sm">
                    {search
                      ? "Kategori tidak ditemukan"
                      : "Belum ada kategori. Klik '+ Tambah Kategori'."}
                  </td>
                </tr>
              ) : (
                data.map((c) => (
                  <tr key={c.id} className="tr">
                    <td className="td font-medium text-gray-900 dark:text-white">
                      {c.name}
                    </td>
                    <td className="td">
                      <code className="text-xs bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
                        {c.slug}
                      </code>
                    </td>
                    <td className="td text-center">
                      <span className="badge-blue">
                        {c.products_count ?? 0} produk
                      </span>
                    </td>
                    <td className="td">
                      <span className={c.is_active ? "badge-green" : "badge-gray"}>
                        {c.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="td">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openEdit(c)}
                          className="text-blue-600 hover:underline text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.name)}
                          className="text-red-500 hover:underline text-xs font-medium"
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
        title={editing ? "Edit Kategori" : "Tambah Kategori"}
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
              form="category-form"
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </>
        }
      >
        <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Nama Kategori *</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              placeholder="Contoh: Makanan & Minuman"
            />
          </div>
          <div>
            <label className="label">Deskripsi</label>
            <textarea
              className="input resize-none"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Deskripsi kategori (opsional)"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="cat_active"
              checked={form.is_active}
              onChange={(e) =>
                setForm((f) => ({ ...f, is_active: e.target.checked }))
              }
              className="w-4 h-4 rounded"
            />
            <label
              htmlFor="cat_active"
              className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              Kategori aktif
            </label>
          </div>
        </form>
      </Modal>
    </div>
  );
}