import { AuthLeftPanel } from "@/features/auth/components/AuthLeftPanel";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-900">
      <AuthLeftPanel variant="login" />
      <LoginForm />
    </div>
  );
}