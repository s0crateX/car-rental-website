"use client";

import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Preloader } from "@/components/common/preloader";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Preloader className="w-24 h-24" />
      </div>
    );
  }
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-screen-2xl px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}