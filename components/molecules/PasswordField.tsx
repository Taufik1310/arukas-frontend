"use client";
import { Input } from "@/components/atoms/Input";
import { cn } from "@/lib/utils";
import { forwardRef, InputHTMLAttributes, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  containerClassName?: string;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(({
  label, error, hint, required, id,
  containerClassName, className, ...props
}, ref) => {
  const [show, setShow] = useState(false);
  return (
    <div className={cn("space-y-1", containerClassName)}>
      {label && (
        <label htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <Input
          ref={ref} id={id} type={show ? "text" : "password"}
          error={!!error} className={cn("pr-11", className)} {...props}
        />
        <button
          type="button" tabIndex={-1}
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          {show ? <FiEyeOff size={17} /> : <FiEye size={17} />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
});
PasswordField.displayName = "PasswordField";