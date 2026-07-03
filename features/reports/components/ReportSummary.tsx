import { StatCard }         from "@/components/molecules/StatCard";
import { formatRupiah }     from "@/lib/utils";
import { ReportSummaryData } from "../hooks/useReports";
import { FiTrendingUp, FiPercent } from "react-icons/fi";
import { BiReceipt }        from "react-icons/bi";

interface Props { summary: ReportSummaryData }

export function ReportSummary({ summary }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        label="Total Transaksi"
        value={summary.total_transaksi}
        sub="transaksi pada periode ini"
        icon={<BiReceipt size={20} className="text-blue-600" />}
        iconBg="bg-blue-50 dark:bg-blue-900/30"
      />
      <StatCard
        label="Total Pendapatan"
        value={formatRupiah(summary.total_pendapatan)}
        sub="dari transaksi lunas"
        icon={<FiTrendingUp size={20} className="text-emerald-600" />}
        iconBg="bg-emerald-50 dark:bg-emerald-900/30"
        valueColor="text-emerald-600 dark:text-emerald-400"
      />
      <StatCard
        label="Total Diskon"
        value={formatRupiah(summary.total_diskon)}
        sub="diberikan ke pelanggan"
        icon={<FiPercent size={20} className="text-amber-600" />}
        iconBg="bg-amber-50 dark:bg-amber-900/30"
        valueColor="text-amber-600 dark:text-amber-400"
      />
    </div>
  );
}