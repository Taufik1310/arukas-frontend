"use client";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";
import { supplierApi } from "@/lib/api";
import { PaginationMeta, Supplier } from "@/types";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

type FormState = {
  name: string; email: string; phone: string;
  address: string; city: string; notes: string;
  is_active: boolean;
};

const INITIAL: FormState = {
  name: "", email: "", phone: "",
  address: "", city: "", notes: "",
  is_active: true,
};

export default function SuppliersPage() {
  const [data,    setData]    = useState<Supplier[]>([]);
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
      const { data: r } = await supplierApi.list({ search, page });
      setData(r.data);
      setMeta(r.meta);
    } catch {
      toast.error("Gagal memuat supplier");
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchData();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchData]);

  const ch =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const openAdd = () => {
    setForm(INITIAL);
    setEditing(null);
    setModal(true);
  };

  const openEdit = (s: Supplier) => {
    setForm({
      name:      s.name,
      email:     s.email     ?? "",
      phone:     s.phone,
      address:   s.address   ?? "",
      city:      s.city      ?? "",
      notes:     s.notes     ?? "",
      is_active: s.is_active,
    });
    setEditing(s.id);
    setModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (editing) {
        await supplierApi.update(editing, payload);
        toast.success("Supplier berhasil diperbarui");
      } else {
        await supplierApi.store(payload);
        toast.success("Supplier berhasil ditambahkan");
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
        toast.error("Gagal menyimpan supplier");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus supplier "${name}"?`)) return;
    try {
      await supplierApi.delete(id);
      toast.success("Supplier dihapus");
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
          <h1 className="page-title">Data Supplier</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Kelola data pemasok produk
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          + Tambah Supplier
        </button>
      </div>

      <div className="card">
        <input
          className="input mb-5 max-w-xs"
          placeholder="Cari nama, kode, telepon..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="th">Supplier</th>
                <th className="th">Telepon</th>
                <th className="th">Kota</th>
                <th className="th text-center">Produk</th>
                <th className="th">Status</th>
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
                    {search
                      ? "Supplier tidak ditemukan"
                      : "Belum ada supplier. Klik '+ Tambah Supplier'."}
                  </td>
                </tr>
              ) : (
                data.map((s) => (
                  <tr key={s.id} className="tr">
                    <td className="td">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {s.name}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">{s.code}</p>
                    </td>
                    <td className="td">{s.phone}</td>
                    <td className="td text-gray-500 dark:text-gray-400">
                      {s.city ?? "-"}
                    </td>
                    <td className="td text-center">
                      <span className="badge-blue">
                        {s.products_count ?? 0}
                      </span>
                    </td>
                    <td className="td">
                      <span className={s.is_active ? "badge-green" : "badge-gray"}>
                        {s.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="td">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openEdit(s)}
                          className="text-blue-600 hover:underline text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s.id, s.name)}
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
        title={editing ? "Edit Supplier" : "Tambah Supplier"}
        size="lg"
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
              form="supplier-form"
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </>
        }
      >
        <form
          id="supplier-form"
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4"
        >
          <div className="col-span-2">
            <label className="label">Nama Supplier *</label>
            <input
              className="input"
              value={form.name}
              onChange={ch("name")}
              required
              placeholder="Nama perusahaan atau perorangan"
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              value={form.email}
              onChange={ch("email")}
              placeholder="email@supplier.com"
            />
          </div>
          <div>
            <label className="label">Telepon *</label>
            <input
              className="input"
              value={form.phone}
              onChange={ch("phone")}
              required
              placeholder="08xxxxxxxxxx"
            />
          </div>
          <div>
            <label className="label">Kota</label>
            <input
              className="input"
              value={form.city}
              onChange={ch("city")}
              placeholder="Jakarta, Surabaya..."
            />
          </div>
          <div>
            <label className="label">Status</label>
            <select
              className="input"
              value={form.is_active ? "1" : "0"}
              onChange={(e) =>
                setForm((f) => ({ ...f, is_active: e.target.value === "1" }))
              }
            >
              <option value="1">Aktif</option>
              <option value="0">Nonaktif</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="label">Alamat</label>
            <textarea
              className="input resize-none"
              rows={2}
              value={form.address}
              onChange={ch("address")}
              placeholder="Alamat lengkap supplier"
            />
          </div>
          <div className="col-span-2">
            <label className="label">Catatan</label>
            <textarea
              className="input resize-none"
              rows={2}
              value={form.notes}
              onChange={ch("notes")}
              placeholder="Catatan tambahan (opsional)"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}