"use client";
import { Button } from "@/components/atoms/Button";
import { FcGoogle } from "react-icons/fc";

interface Props { label?: string; }

export function GoogleAuthButton({ label = "Lanjutkan dengan Google" }: Props) {
  return (
    <Button
      type="button"
      variant="outline"
      fullWidth
      leftIcon={<FcGoogle size={20} />}
      className="py-3 border-2 hover:border-gray-300 dark:hover:border-slate-500"
      onClick={() => { window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/redirect`; }}
    >
      {label}
    </Button>
  );
}