import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard roles={["OWNER"]}>
      <DashboardShell userRole="OWNER">{children}</DashboardShell>
    </RoleGuard>
  );
}
