"use client";

import { BedDouble, HandCoins, KeyRound, Wallet } from "lucide-react";
import {
  PropertyRevenueChart,
  RevenueChart,
  StatusDonut,
} from "@/components/shared/charts";
import QueryError from "@/components/shared/query-error";
import SectionCard from "@/components/shared/section-card";
import StatCard from "@/components/shared/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOwnerStats } from "@/hooks";
import { formatCurrency } from "@/utils";

// Rent collected, what's still owed, how full the rooms are, and which listings earn the most (B4)
export default function OwnerEarnings() {
  const { data, isPending, isError, error, refetch } = useOwnerStats();
  const stats = data?.data;

  if (isError) {
    return (
      <QueryError
        error={error}
        onRetry={() => refetch()}
        title="Couldn't load your earnings"
      />
    );
  }

  const chart = (height: string, render: () => React.ReactNode) =>
    isPending || !stats ? (
      <Skeleton className={`${height} w-full`} />
    ) : (
      render()
    );
  const months = stats?.payments.monthlyRevenue.length ?? 6;
  const thisMonth = stats?.payments.monthlyRevenue.at(-1)?.revenue ?? 0;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Wallet}
          label="Rent collected"
          value={formatCurrency(stats?.payments.totalRevenue ?? 0)}
          hint={
            stats &&
            `${stats.payments.paid} paid bill${stats.payments.paid === 1 ? "" : "s"} · ${formatCurrency(thisMonth)} this month`
          }
          href="/owner/payments?status=PAID"
          loading={isPending}
        />
        <StatCard
          icon={HandCoins}
          label="Outstanding"
          value={formatCurrency(stats?.payments.outstanding ?? 0)}
          hint={
            stats &&
            `${stats.payments.unpaid} unpaid bill${stats.payments.unpaid === 1 ? "" : "s"}`
          }
          href="/owner/payments?status=PENDING"
          loading={isPending}
        />
        <StatCard
          icon={BedDouble}
          label="Occupancy"
          value={`${stats?.rooms.occupancyRate ?? 0}%`}
          hint={
            stats &&
            `${stats.rooms.occupied + stats.rooms.reserved} of ${stats.rooms.total} rooms taken`
          }
          href="/owner/properties"
          loading={isPending}
        />
        <StatCard
          icon={KeyRound}
          label="Active rentals"
          value={stats?.rentals.active ?? 0}
          hint={
            stats &&
            `${stats.rentals.pending} awaiting first rent · ${stats.applications.pending} application${stats.applications.pending === 1 ? "" : "s"} to review`
          }
          href="/owner/rentals"
          loading={isPending}
        />
      </div>

      <SectionCard
        title="Monthly earnings"
        description={`Rent paid through Stripe over the last ${months} months`}
      >
        {chart("h-64", () => (
          <RevenueChart data={stats?.payments.monthlyRevenue ?? []} />
        ))}
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Earnings by property"
          description="All-time rent collected"
          href="/owner/properties"
          linkLabel="Properties"
        >
          {chart("h-56", () => (
            <PropertyRevenueChart data={stats?.payments.byProperty ?? []} />
          ))}
        </SectionCard>
        <SectionCard
          title="Bills by status"
          href="/owner/payments"
          linkLabel="Payments"
        >
          {chart("h-48", () => (
            <StatusDonut
              data={stats?.payments.byStatus ?? {}}
              centerLabel="bills"
            />
          ))}
        </SectionCard>
      </div>

      <SectionCard
        title="Rooms by status"
        href="/owner/properties"
        linkLabel="Properties"
      >
        {chart("h-48", () => (
          <StatusDonut data={stats?.rooms.byStatus ?? {}} centerLabel="rooms" />
        ))}
      </SectionCard>
    </div>
  );
}
