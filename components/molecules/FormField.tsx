import { Input } from "@/components/atoms/Input";
import { cn } from "@/lib/utils";
import { forwardRef, InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  containerClassName?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(({
  label, error, hint, required, id,
  containerClassName, className, ...props
}, ref) => (
  <div className={cn("space-y-1", containerClassName)}>
    {label && (
      <label htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <Input ref={ref} id={id} error={!!error} className={className} {...props} />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </div>
));
FormField.displayName = "FormField";