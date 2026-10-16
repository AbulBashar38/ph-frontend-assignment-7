import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";

// Stripe sends tenants back here after checkout (see proxy.ts: /payment is tenant-only)
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard roles={["TENANT"]}>
      <DashboardShell userRole="TENANT">{children}</DashboardShell>
    </RoleGuard>
  );
}
