"use client";

import { FileSearch, SearchX } from "lucide-react";
import Link from "next/link";
import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import ListFooter from "@/components/shared/list-footer";
import ListToolbar from "@/components/shared/list-toolbar";
import PersonCell from "@/components/shared/person-cell";
import QueryError from "@/components/shared/query-error";
import StatusBadge from "@/components/shared/status-badge";
import TableSkeleton from "@/components/shared/table-skeleton";
import UrlSelect from "@/components/shared/url-select";
import UrlTabs from "@/components/shared/url-tabs";
import { Button } from "@/components/ui/button";
import {
  useApplications,
  useAuth,
  useManagedProperties,
  useUrlState,
} from "@/hooks";
import type { ApplicationListItem, ApplicationStatus } from "@/types";
import { formatCurrency, formatDate, toPositiveInt } from "@/utils";
import ApplicationActions from "./application-actions";

const PAGE_SIZE = 10;

const STATUS_TABS: { value: "" | ApplicationStatus; label: string }[] = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Declined" },
  { value: "CANCELLED", label: "Withdrawn" },
  { value: "EXPIRED", label: "Expired" },
];
const STATUSES = new Set<string>(STATUS_TABS.map((tab) => tab.value));

const SORTS = {
  "": { sortBy: "createdAt", sortOrder: "desc" },
  "move-in": { sortBy: "moveInDate", sortOrder: "asc" },
} as const;

function columns(isTenant: boolean): DataTableColumn<ApplicationListItem>[] {
  return [
    {
      key: "person",
      header: isTenant ? "Owner" : "Tenant",
      cell: (application) => {
        if (isTenant) {
          const owner = application.property.owner;
          return (
            <PersonCell
              name={owner.name}
              imageUrl={owner.imageUrl}
              detail={owner.phone ?? undefined}
            />
          );
        }
        const tenant = application.tenant;
        return (
          <PersonCell
            name={tenant.name}
            imageUrl={tenant.imageUrl}
            detail={tenant.occupation ?? tenant.phone ?? undefined}
          />
        );
      },
    },
    {
      key: "room",
      header: "Room",
      className: "whitespace-normal",
      cell: (application) => (
        <div className="min-w-44">
          <Link
            href={`/rooms/${application.room.id}`}
            className="line-clamp-1 font-medium hover:text-primary hover:underline"
          >
            {application.room.name}
          </Link>
          <p className="line-clamp-1 text-sm text-muted-foreground">
            {application.property.title}
          </p>
          <p className="text-sm font-medium text-primary tabular-nums">
            {formatCurrency(application.room.monthlyRent)}/month
          </p>
        </div>
      ),
    },
    {
      key: "move-in",
      header: "Move-in",
      responsive: "hidden md:table-cell",
      cell: (application) => (
        <div>
          <p className="tabular-nums">{formatDate(application.moveInDate)}</p>
          <p className="text-sm text-muted-foreground">
            {application.occupants}{" "}
            {application.occupants === 1 ? "person" : "people"}
          </p>
        </div>
      ),
    },
    {
      key: "message",
      header: "Message",
      responsive: "hidden xl:table-cell",
      className: "whitespace-normal",
      cell: (application) => {
        const note =
          application.rejectionReason ??
          application.cancellationReason ??
          application.message;
        return note ? (
          <p
            className="line-clamp-2 max-w-60 text-sm text-muted-foreground"
            title={note}
          >
            {note}
          </p>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      cell: (application) => (
        <div className="space-y-1">
          <StatusBadge status={application.status} />
          <p className="text-xs text-muted-foreground">
            {application.status === "PENDING"
              ? `Expires ${formatDate(application.expiresAt)}`
              : `Applied ${formatDate(application.createdAt)}`}
          </p>
        </div>
      ),
    },
    {
      key: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "text-right",
      cell: (application) => <ApplicationActions application={application} />,
    },
  ];
}

// Rental applications: owners approve or decline, tenants follow and withdraw their own
export default function ApplicationTable({ pathname }: { pathname: string }) {
  const { isTenant, isOwner } = useAuth();
  const { get, clear } = useUrlState();
  const status = STATUSES.has(get("status"))
    ? (get("status") as ApplicationStatus | "")
    : "";
  const sort = get("sort") === "move-in" ? "move-in" : "";
  const propertyId = get("propertyId");
  const page = toPositiveInt(get("page"), 1);
  const filtered = Boolean(status || propertyId);

  const query = useApplications(
    {
      status: status || undefined,
      propertyId: propertyId || undefined,
      page,
      limit: PAGE_SIZE,
      ...SORTS[sort],
    },
    { keepPrevious: true },
  );
  const properties = useManagedProperties({ limit: 100 }, { enabled: isOwner });

  const toolbar = (
    <ListToolbar
      tabs={<UrlTabs label="Filter by status" options={STATUS_TABS} />}
    >
      {isOwner && (
        <UrlSelect
          urlKey="propertyId"
          label="Filter by property"
          className="sm:w-60"
          options={[
            { value: "", label: "All properties" },
            ...(properties.data?.data ?? []).map((property) => ({
              value: property.id,
              label: property.title,
            })),
          ]}
        />
      )}
      <UrlSelect
        urlKey="sort"
        label="Sort"
        className="sm:w-48"
        options={[
          { value: "", label: "Newest first" },
          { value: "move-in", label: "Move-in date" },
        ]}
      />
    </ListToolbar>
  );

  if (query.isPending) return <TableSkeleton />;

  return (
    <div className="space-y-4">
      {toolbar}
      {query.isError ? (
        <QueryError error={query.error} onRetry={() => query.refetch()} />
      ) : (
        <>
          <div
            className={
              query.isPlaceholderData ? "opacity-60 transition-opacity" : ""
            }
          >
            <DataTable
              columns={columns(isTenant)}
              rows={query.data.data}
              getRowId={(application) => application.id}
              empty={
                filtered ? (
                  <EmptyState
                    icon={SearchX}
                    title="No applications match"
                    description="Try another status or property."
                    action={
                      <Button
                        variant="outline"
                        onClick={() => clear(["status", "propertyId"])}
                      >
                        Clear filters
                      </Button>
                    }
                  />
                ) : (
                  <EmptyState
                    icon={FileSearch}
                    title="No applications yet"
                    description={
                      isTenant
                        ? "Apply for a room from its page and follow the answer here."
                        : "When tenants apply for your rooms, you'll review them here."
                    }
                    action={
                      isTenant ? (
                        <Button render={<Link href="/rooms" />}>
                          Browse rooms
                        </Button>
                      ) : undefined
                    }
                  />
                )
              }
            />
          </div>
          <ListFooter
            meta={query.data.meta}
            pathname={pathname}
            noun={["application", "applications"]}
          />
        </>
      )}
    </div>
  );
}
