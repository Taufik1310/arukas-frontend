"use client";
import { activityApi } from "@/lib/api";
import { ActivityLog, PaginationMeta } from "@/types";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

export function useActivityLogs() {
  const [logs,       setLogs]       = useState<ActivityLog[]>([]);
  const [meta,       setMeta]       = useState<PaginationMeta | null>(null);
  const [search,     setSearch]     = useState("");
  const [actionFilter, setAction]   = useState("");
  const [page,       setPage]       = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [detailLog,  setDetailLog]  = useState<ActivityLog | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await activityApi.list({
        search:   search       || undefined,
        action:   actionFilter || undefined,
        page,
        per_page: 20,
      });
      setLogs(data.data); setMeta(data.meta);
    } catch { toast.error("Gagal memuat activity log"); }
    finally  { setLoading(false); }
  }, [search, actionFilter, page]);

  useEffect(() => {
    void Promise.resolve().then(fetchData);
  }, [fetchData]);

  const handleSearchChange = (v: string) => { setSearch(v); setPage(1); };
  const handleActionChange = (v: string) => { setAction(v); setPage(1); };

  return {
    logs, meta, search, actionFilter, page, loading, detailLog,
    handleSearchChange, handleActionChange,
    setPage, setDetailLog,
  };
}