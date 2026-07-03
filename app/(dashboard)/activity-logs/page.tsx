"use client";
import { PageHeader }          from "@/components/molecules/PageHeader";
import { ActivityLogFilters }  from "@/features/activity-logs/components/ActivityLogFilters";
import { ActivityLogTable }    from "@/features/activity-logs/components/ActivityLogTable";
import { AuditTrailModal }     from "@/features/activity-logs/components/AuditTrailModal";
import { useActivityLogs }     from "@/features/activity-logs/hooks/useActivityLogs";

export default function ActivityLogsPage() {
  const logs = useActivityLogs();

  return (
    <div className="space-y-5">
      <PageHeader
        title="Activity Log & Audit Trail"
        description="Riwayat semua aktivitas pengguna di sistem"
      />

      <div className="card">
        <ActivityLogFilters
          search={logs.search}
          actionFilter={logs.actionFilter}
          onSearchChange={logs.handleSearchChange}
          onActionChange={logs.handleActionChange}
        />
        <ActivityLogTable
          logs={logs.logs} loading={logs.loading}
          meta={logs.meta}
          onViewDetail={logs.setDetailLog}
          onPageChange={logs.setPage}
        />
      </div>

      <AuditTrailModal
        log={logs.detailLog}
        onClose={() => logs.setDetailLog(null)}
      />
    </div>
  );
}