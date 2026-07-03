interface Props { password: string; }

function getStrength(p: string): number {
  if (!p) return 0;
  let score = 0;
  if (p.length >= 8)  score++;
  if (p.length >= 12) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  return Math.min(4, Math.ceil(score / 1.25));
}

const LABELS = ["", "Lemah", "Cukup", "Kuat", "Sangat Kuat"];
const COLORS = ["", "bg-red-400", "bg-amber-400", "bg-blue-500", "bg-green-500"];

export function PasswordStrength({ password }: Props) {
  if (!password) return null;
  const strength = getStrength(password);
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((l) => (
          <div key={l} className={`h-1 flex-1 rounded-full transition-all ${l <= strength ? COLORS[strength] : "bg-gray-200 dark:bg-slate-700"}`} />
        ))}
      </div>
      <p className={`text-xs ${strength >= 3 ? "text-green-600 dark:text-green-400" : "text-gray-400"}`}>
        {LABELS[strength]}
      </p>
    </div>
  );
}