interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  valueColor?: string;
}

export function StatCard({ label, value, sub, icon, iconBg, valueColor }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className={`text-2xl font-bold mt-1 ${valueColor ?? "text-gray-900 dark:text-white"}`}>
            {value}
          </p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        {icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg ?? "bg-gray-100 dark:bg-slate-700"}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}