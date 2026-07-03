import { FiCheck } from "react-icons/fi";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-3 mb-8">
      {steps.map((label, i) => {
        const step    = i + 1;
        const done    = step < currentStep;
        const active  = step === currentStep;

        return (
          <div key={step} className="flex items-center gap-3 flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                done || active
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-400"
              }`}>
                {done ? <FiCheck size={14} /> : step}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${
                active ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400"
              }`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 transition-all ${
                done ? "bg-indigo-600" : "bg-gray-200 dark:bg-slate-700"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}