"use client";
import Sidebar             from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Spinner }         from "@/components/atoms/Spinner";
import { useAuth }         from "@/context/AuthContext";
import { useRouter }       from "next/navigation";
import { useEffect }       from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" className="text-blue-600" />
          <p className="text-sm text-gray-400">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header dengan dark mode toggle */}
        <DashboardHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}