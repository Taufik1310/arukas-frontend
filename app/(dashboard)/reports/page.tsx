"use client";
import { Button }          from "@/components/atoms/Button";
import { PageHeader }      from "@/components/molecules/PageHeader";
import { ReportFilters }   from "@/features/reports/components/ReportFilters";
import { ReportLineChart } from "@/features/reports/components/ReportLineChart";
import { ReportSummary }   from "@/features/reports/components/ReportSummary";
import { ReportTable }     from "@/features/reports/components/ReportTable";
import { useReports }      from "@/features/reports/hooks/useReports";
import { FiDownload }      from "react-icons/fi";

export default function ReportsPage() {
  const rep = useReports();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Laporan Penjualan"
        description="Ringkasan dan detail transaksi penjualan"
        actions={
          <>
            <Button
              variant="outline" size="sm"
              leftIcon={<FiDownload size={13} />}
              loading={rep.exporting === "excel"}
              disabled={rep.exporting !== null}
              onClick={() => rep.handleExport("excel")}
            >
              Excel
            </Button>
            <Button
              variant="outline" size="sm"
              leftIcon={<FiDownload size={13} />}
              loading={rep.exporting === "pdf"}
              disabled={rep.exporting !== null}
              onClick={() => rep.handleExport("pdf")}
            >
              PDF
            </Button>
          </>
        }
      />

      <ReportFilters filter={rep.filter} onUpdate={rep.updateFilter} />

      {rep.summary && <ReportSummary summary={rep.summary} />}

      <ReportLineChart data={rep.chartData} />

      <ReportTable
        data={rep.sales} loading={rep.loading}
        meta={rep.meta} onPageChange={rep.setPage}
      />
    </div>
  );
}