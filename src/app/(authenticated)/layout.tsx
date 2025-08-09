import type { ReactNode } from "react";
import { DesktopSidebar } from "@/components/layout/desktop-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { AppHeader } from "@/components/layout/app-header";

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <DesktopSidebar />
      <div className="flex flex-1 flex-col sm:pl-16">
        <AppHeader />
        <main className="flex-1 p-4 pb-20 sm:p-6 lg:p-8 sm:pb-6">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
