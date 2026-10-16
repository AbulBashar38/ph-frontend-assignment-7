"use client";

import {
  CalendarCheck,
  CreditCard,
  FileText,
  KeyRound,
  Search,
} from "lucide-react";
import Link from "next/link";
import DashboardPageHeader from "@/components/shared/dashboard-page-header";
import SectionCard from "@/components/shared/section-card";
import StatCard from "@/components/shared/stat-card";
import StatusBadge from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  useApplications,
  useAuth,
  usePayments,
  useRentals,
  useViewings,
} from "@/hooks";
import { formatCurrency, formatDate, formatDateTime } from "@/utils";
import ActivityRow from "./activity-row";
import { ListEmpty, ListSkeleton } from "./list-state";

const OPEN_VIEWINGS = new Set(["PENDING", "APPROVED", "RESCHEDULED"]);

export default function TenantOverview() {
  const { user } = useAuth();
  const applications = useApplications({
    limit: 5,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const pendingApplications = useApplications({ limit: 1, status: "PENDING" });
  const viewings = useViewings({
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const rentals = useRentals({
    limit: 1,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const duePayments = usePayments({
    limit: 20,
    status: "PENDING",
    sortBy: "dueDate",
    sortOrder: "asc",
  });

  const openViewings = (viewings.data?.data ?? []).filter((viewing) =>
    OPEN_VIEWINGS.has(viewing.status),
  );
  const due = duePayments.data?.data ?? [];
  const nextPayment = due[0];
  const rental = rentals.data?.data[0];

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title={`Welcome back${user ? `, ${user.name.split(" ")[0]}` : ""}`}
        description="Your viewings, applications and rent in one place."
        actions={
          <Link
            href="/properties"
            className={buttonVariants({ variant: "outline" })}
          >
            <Search />
            Find a place
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={FileText}
          label="Pending applications"
          value={pendingApplications.data?.meta?.total ?? 0}
          hint="Waiting for the owner's decision"
          href="/dashboard/applications"
          loading={pendingApplications.isPending}
        />
        <StatCard
          icon={CalendarCheck}
          label="Upcoming viewings"
          value={openViewings.length}
          hint="Requested, confirmed or rescheduled"
          href="/dashboard/viewings"
          loading={viewings.isPending}
        />
        <StatCard
          icon={CreditCard}
          label="Rent due"
          value={formatCurrency(
            due.reduce((sum, payment) => sum + payment.amount, 0),
          )}
          hint={
            nextPayment
              ? `Next due ${formatDate(nextPayment.dueDate, "dd MMM")}`
              : "Nothing to pay right now"
          }
          href="/dashboard/payments"
          loading={duePayments.isPending}
        />
        <StatCard
          icon={KeyRound}
          label="Current rental"
          value={
            rental ? (
              <StatusBadge status={rental.status} size="default" />
            ) : (
              "None"
            )
          }
          hint={
            rental
              ? `${rental.room.name}, ${rental.property.area}`
              : "Apply for a room to start renting"
          }
          href="/dashboard/rentals"
          loading={rentals.isPending}
        />
      </div>

      {nextPayment && (
        <div className="flex flex-col gap-4 rounded-2xl border border-highlight/50 bg-highlight/10 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-highlight-foreground">
              Rent due {formatDate(nextPayment.dueDate, "dd MMM yyyy")}
            </p>
            <p className="mt-1 font-heading text-2xl font-bold">
              {formatCurrency(nextPayment.amount)}
            </p>
            <p className="text-sm text-muted-foreground">
              {nextPayment.rental.room.name},{" "}
              {nextPayment.rental.property.title}
            </p>
          </div>
          <Link
            href="/dashboard/payments"
            className={buttonVariants({ variant: "highlight" })}
          >
            <CreditCard />
            Go to payments
          </Link>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Your applications" href="/dashboard/applications">
          {applications.isPending ? (
            <ListSkeleton />
          ) : (applications.data?.data ?? []).length === 0 ? (
            <ListEmpty>
              No applications yet.{" "}
              <Link
                href="/rooms"
                className="font-medium text-primary hover:underline"
              >
                Browse rooms
              </Link>
            </ListEmpty>
          ) : (
            <ul className="divide-y">
              {applications.data?.data.map((application) => (
                <ActivityRow
                  key={application.id}
                  title={`${application.room.name} · ${formatCurrency(application.room.monthlyRent)}/mo`}
                  subtitle={application.property.title}
                  meta={`Move in ${formatDate(application.moveInDate)}`}
                  status={application.status}
                />
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Upcoming viewings" href="/dashboard/viewings">
          {viewings.isPending ? (
            <ListSkeleton />
          ) : openViewings.length === 0 ? (
            <ListEmpty>No viewings planned.</ListEmpty>
          ) : (
            <ul className="divide-y">
              {openViewings.slice(0, 5).map((viewing) => (
                <ActivityRow
                  key={viewing.id}
                  title={viewing.room?.name ?? viewing.property.title}
                  subtitle={viewing.property.title}
                  meta={formatDateTime(
                    viewing.scheduledAt ?? viewing.preferredAt,
                  )}
                  status={viewing.status}
                />
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
