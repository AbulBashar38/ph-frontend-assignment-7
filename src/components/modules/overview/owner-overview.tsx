"use client";

import {
  Building2,
  CalendarCheck,
  DoorOpen,
  FileText,
  PlusSquare,
} from "lucide-react";
import Link from "next/link";
import { StatusDonut } from "@/components/shared/charts";
import DashboardPageHeader from "@/components/shared/dashboard-page-header";
import SectionCard from "@/components/shared/section-card";
import StatCard from "@/components/shared/stat-card";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useApplications,
  useAuth,
  useManagedProperties,
  useManagedRooms,
  useViewings,
} from "@/hooks";
import type { RoomStatus } from "@/types";
import { formatDate, formatDateTime } from "@/utils";
import ActivityRow from "./activity-row";
import { ListEmpty, ListSkeleton } from "./list-state";

const ROOM_STATUSES: RoomStatus[] = [
  "AVAILABLE",
  "RESERVED",
  "OCCUPIED",
  "UNAVAILABLE",
  "MAINTENANCE",
];

export default function OwnerOverview() {
  const { user } = useAuth();
  const properties = useManagedProperties({ limit: 1 });
  const published = useManagedProperties({ limit: 1, status: "PUBLISHED" });
  const rooms = useManagedRooms({ limit: 100 });
  const pendingApplications = useApplications({
    limit: 5,
    status: "PENDING",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const pendingViewings = useViewings({
    limit: 5,
    status: "PENDING",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const roomList = rooms.data?.data ?? [];
  const byStatus = Object.fromEntries(
    ROOM_STATUSES.map((status) => [
      status,
      roomList.filter((room) => room.status === status).length,
    ]),
  ) as Record<RoomStatus, number>;
  const taken = byStatus.OCCUPIED + byStatus.RESERVED;

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title={`Welcome back${user ? `, ${user.name.split(" ")[0]}` : ""}`}
        description="How your listings are doing and what needs your attention."
        actions={
          <Link href="/owner/properties/new" className={buttonVariants()}>
            <PlusSquare />
            Add property
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Building2}
          label="Published listings"
          value={published.data?.meta?.total ?? 0}
          hint={`${properties.data?.meta?.total ?? 0} listings in total`}
          href="/owner/properties"
          loading={published.isPending || properties.isPending}
        />
        <StatCard
          icon={DoorOpen}
          label="Rooms taken"
          value={`${taken}/${roomList.length}`}
          hint={`${byStatus.AVAILABLE} available to rent`}
          href="/owner/properties"
          loading={rooms.isPending}
        />
        <StatCard
          icon={FileText}
          label="Applications to review"
          value={pendingApplications.data?.meta?.total ?? 0}
          href="/owner/applications"
          loading={pendingApplications.isPending}
        />
        <StatCard
          icon={CalendarCheck}
          label="Viewing requests"
          value={pendingViewings.data?.meta?.total ?? 0}
          hint="Waiting for your answer"
          href="/owner/viewings"
          loading={pendingViewings.isPending}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <SectionCard
          title="Room occupancy"
          description="Every room across your listings"
        >
          {rooms.isPending ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <StatusDonut data={byStatus} centerLabel="rooms" />
          )}
        </SectionCard>

        <SectionCard title="Applications to review" href="/owner/applications">
          {pendingApplications.isPending ? (
            <ListSkeleton />
          ) : (pendingApplications.data?.data ?? []).length === 0 ? (
            <ListEmpty>No applications waiting. Nice work!</ListEmpty>
          ) : (
            <ul className="divide-y">
              {pendingApplications.data?.data.map((application) => (
                <ActivityRow
                  key={application.id}
                  title={application.tenant.name}
                  subtitle={`${application.room.name} · ${application.property.title}`}
                  meta={`Wants to move in ${formatDate(application.moveInDate)} · ${application.occupants} ${application.occupants === 1 ? "person" : "people"}`}
                  status={application.status}
                />
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Viewing requests" href="/owner/viewings">
        {pendingViewings.isPending ? (
          <ListSkeleton />
        ) : (pendingViewings.data?.data ?? []).length === 0 ? (
          <ListEmpty>No viewing requests right now.</ListEmpty>
        ) : (
          <ul className="divide-y">
            {pendingViewings.data?.data.map((viewing) => (
              <ActivityRow
                key={viewing.id}
                title={viewing.tenant.name}
                subtitle={`${viewing.room?.name ?? "Whole property"} · ${viewing.property.title}`}
                meta={`Asked for ${formatDateTime(viewing.preferredAt)}`}
                status={viewing.status}
              />
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
