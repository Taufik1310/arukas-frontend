"use client";
import { AuthLeftPanel }    from "@/features/auth/components/AuthLeftPanel";
import { RegisterStep1 }    from "@/features/auth/components/RegisterStep1";
import { RegisterStep2 }    from "@/features/auth/components/RegisterStep2";
import { StepIndicator }    from "@/features/auth/components/StepIndicator";
import { useRegisterStepper } from "@/features/auth/hooks/useRegisterStepper";
import { authApi }          from "@/lib/api";
import { useRouter }        from "next/navigation";
import { useState }         from "react";
import toast                from "react-hot-toast";

export default function RegisterPage() {
  const { step, form, update, next, back } = useRegisterStepper();
  const [submitting, setSub] = useState(false);
  const router = useRouter();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Nama wajib diisi"); return; }
    if (!form.email.trim()) { toast.error("Email wajib diisi"); return; }
    next();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) { toast.error("Password tidak sama"); return; }
    if (form.password.length < 8) { toast.error("Password minimal 8 karakter"); return; }
    setSub(true);
    try {
      await authApi.register(form);
      toast.success("Registrasi berhasil! Silakan login.");
      router.push("/login");
    } catch (err: unknown) {
      const errors = (err as { response?: { data?: { errors?: Record<string,string[]> } } })?.response?.data?.errors;
      if (errors) Object.values(errors).flat().forEach((m) => toast.error(m));
      else toast.error("Registrasi gagal");
    } finally { setSub(false); }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-900">
      <AuthLeftPanel variant="register" />

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-12 overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Buat Akun Baru 🚀</h1>
            <p className="text-gray-500 dark:text-gray-400">Daftar gratis dan mulai kelola toko hari ini</p>
          </div>

          <StepIndicator currentStep={step} steps={["Info Dasar", "Password"]} />

          {step === 1
            ? <RegisterStep1 form={form} onUpdate={update} onNext={handleNext} />
            : <RegisterStep2 form={form} onUpdate={update} onBack={back} onSubmit={handleSubmit} submitting={submitting} />
          }

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Sudah punya akun?{" "}
            <a href="/login" className="text-indigo-600 hover:underline font-semibold">Masuk di sini</a>
          </p>
        </div>
      </div>
    </div>
  );
}