import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { UserRole } from "@/types";
import DashboardHeader from "./dashboard-header";
import DashboardSidebar from "./dashboard-sidebar";

export default function DashboardShell({
  children,
  userRole,
}: {
  children: ReactNode;
  userRole: UserRole;
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar userRole={userRole} />
      <SidebarInset>
        <DashboardHeader userRole={userRole} />
        <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
