import { Navbar } from "@/components/layout/navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
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