"use client";
import { productApi, purchaseApi, supplierApi } from "@/lib/api";
import { PaginationMeta, Product, PurchaseTransaction, Supplier } from "@/types";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface POItem {
  product_id:   number;
  product_name: string;
  quantity:     number;
  unit_price:   number;
}

export type POFormState = {
  supplier_id: string;
  order_date:  string;
  notes:       string;
  items:       POItem[];
};

const INITIAL_FORM: POFormState = {
  supplier_id: "",
  order_date:  new Date().toISOString().slice(0, 10),
  notes:       "",
  items:       [],
};

type ApiError = { response?: { data?: { message?: string } } };

export function usePurchases() {
  // ── List State ────────────────────────────────────────────────────────
  const [data,          setData]          = useState<PurchaseTransaction[]>([]);
  const [meta,          setMeta]          = useState<PaginationMeta | null>(null);
  const [search,        setSearch]        = useState("");
  const [statusFilter,  setStatusFilter]  = useState("");
  const [page,          setPage]          = useState(1);
  const [loading,       setLoading]       = useState(true);
  const [receiving,     setReceiving]     = useState<number | null>(null);

  // ── Form State ────────────────────────────────────────────────────────
  const [modal,         setModal]         = useState(false);
  const [form,          setForm]          = useState<POFormState>(INITIAL_FORM);
  const [suppliers,     setSuppliers]     = useState<Supplier[]>([]);
  const [productSearch, setPSearch]       = useState("");
  const [searchResults, setSResults]      = useState<Product[]>([]);
  const [saving,        setSaving]        = useState(false);

  const total = form.items.reduce((s, i) => s + i.quantity * i.unit_price, 0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: r } = await purchaseApi.list({
        search: search || undefined,
        status: statusFilter || undefined,
        page,
      });
      setData(r.data); setMeta(r.meta);
    } catch { toast.error("Gagal memuat data pembelian"); }
    finally  { setLoading(false); }
  }, [search, statusFilter, page]);

  useEffect(() => {
    void Promise.resolve().then(fetchData);
  }, [fetchData]);

  useEffect(() => {
    supplierApi.all().then((r) => setSuppliers(r.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
        if (!productSearch.trim()) { 
            setSResults([]);
            return; 
        }

      productApi.list({ search: productSearch, per_page: 8 })
        .then((r) => setSResults(r.data.data)).catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, [productSearch]);

  const handleSearchChange      = (v: string) => { setSearch(v); setPage(1); };
  const handleStatusFilterChange = (v: string) => { setStatusFilter(v); setPage(1); };

  const openModal = () => {
    setForm(INITIAL_FORM); setPSearch(""); setSResults([]); setModal(true);
  };
  const closeModal = () => setModal(false);

  const updateFormField = (key: keyof Omit<POFormState, "items">, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addItem = (p: Product) => {
    if (form.items.find((i) => i.product_id === p.id)) {
      toast("Produk sudah ada di daftar"); return;
    }
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, {
        product_id: p.id, product_name: p.name,
        quantity: 1, unit_price: p.purchase_price,
      }],
    }));
    setPSearch(""); setSResults([]);
  };

  const updateItem = (idx: number, field: "quantity" | "unit_price", val: number) =>
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === idx ? { ...item, [field]: Math.max(1, val) } : item
      ),
    }));

  const removeItem = (idx: number) =>
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.supplier_id) { toast.error("Pilih supplier terlebih dahulu"); return; }
    if (!form.items.length) { toast.error("Tambahkan minimal 1 produk"); return; }
    setSaving(true);
    try {
      await purchaseApi.store({
        supplier_id: Number(form.supplier_id),
        order_date:  form.order_date,
        notes:       form.notes,
        items: form.items.map((i) => ({
          product_id: i.product_id, quantity: i.quantity, unit_price: i.unit_price,
        })),
      });
      toast.success("Purchase Order berhasil dibuat");
      closeModal(); fetchData();
    } catch (err: unknown) {
      toast.error((err as ApiError).response?.data?.message ?? "Gagal membuat PO");
    } finally { setSaving(false); }
  };

  const handleReceive = async (id: number, code: string) => {
    if (!confirm(`Tandai PO ${code} sebagai "Diterima"?\nStok akan diperbarui otomatis.`)) return;
    setReceiving(id);
    try {
      await purchaseApi.receive(id);
      toast.success("Diterima! Stok produk diperbarui.");
      fetchData();
    } catch (err: unknown) {
      toast.error((err as ApiError).response?.data?.message ?? "Gagal menerima");
    } finally { setReceiving(null); }
  };

  return {
    data, meta, search, statusFilter, page, loading, receiving,
    handleSearchChange, handleStatusFilterChange, setPage, handleReceive,
    modal, form, total, suppliers, productSearch, searchResults, saving,
    openModal, closeModal, updateFormField, addItem, updateItem, removeItem,
    setPSearch, handleSubmit,
  };
}