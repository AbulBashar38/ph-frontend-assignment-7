"use client";

import { Building2, KeyRound, ServerCrash, Users, Wallet } from "lucide-react";
import { RevenueChart, StatusDonut } from "@/components/shared/charts";
import DashboardPageHeader from "@/components/shared/dashboard-page-header";
import EmptyState from "@/components/shared/empty-state";
import SectionCard from "@/components/shared/section-card";
import StatCard from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlatformStats } from "@/hooks";
import { formatCurrency } from "@/utils";

export default function AdminOverview() {
  const { data, isPending, isError, refetch } = usePlatformStats();
  const stats = data?.data;

  if (isError) {
    return (
      <EmptyState
        icon={ServerCrash}
        title="Couldn't load the platform statistics"
        description="Please try again in a moment."
        action={<Button onClick={() => refetch()}>Try again</Button>}
      />
    );
  }

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Platform analytics"
        description="Users, listings, rentals and revenue across the whole platform."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users}
          label="Users"
          value={stats?.users.total ?? 0}
          hint={
            stats &&
            `${stats.users.tenants} tenants · ${stats.users.owners} owners · ${stats.users.blocked} blocked`
          }
          href="/admin/users"
          loading={isPending}
        />
        <StatCard
          icon={Building2}
          label="Published listings"
          value={stats?.properties.published ?? 0}
          hint={
            stats &&
            `${stats.properties.total} listings · ${stats.properties.byStatus.SUSPENDED} suspended`
          }
          href="/admin/properties"
          loading={isPending}
        />
        <StatCard
          icon={KeyRound}
          label="Active rentals"
          value={stats?.rentals.active ?? 0}
          hint={stats && `${stats.rentals.pending} waiting for first payment`}
          href="/admin/rentals"
          loading={isPending}
        />
        <StatCard
          icon={Wallet}
          label="Rent collected"
          value={formatCurrency(stats?.payments.totalRevenue ?? 0)}
          hint={
            stats &&
            `${stats.payments.paid} paid · ${stats.payments.unpaid} unpaid`
          }
          href="/admin/payments"
          loading={isPending}
        />
      </div>

      <SectionCard
        title="Monthly revenue"
        description={`Rent paid through Stripe over the last ${stats?.payments.monthlyRevenue.length ?? 6} months`}
      >
        {isPending || !stats ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <RevenueChart data={stats.payments.monthlyRevenue} />
        )}
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Rooms by status">
          {isPending || !stats ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <StatusDonut data={stats.rooms.byStatus} centerLabel="rooms" />
          )}
        </SectionCard>
        <SectionCard title="Applications by status" href="/admin/applications">
          {isPending || !stats ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <StatusDonut
              data={stats.applications.byStatus}
              centerLabel="applications"
            />
          )}
        </SectionCard>
      </div>
    </div>
  );
}
