"use client";

import { Bot, ScrollText } from "lucide-react";
import type { DataTableColumn } from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import FilteredEmptyState from "@/components/shared/filtered-empty-state";
import ListToolbar from "@/components/shared/list-toolbar";
import ListView from "@/components/shared/list-view";
import UrlSelect from "@/components/shared/url-select";
import { Badge } from "@/components/ui/badge";
import { useAuditLogs, useUrlState } from "@/hooks";
import {
  AUDIT_ACTIONS,
  AUDIT_RESOURCES,
  type AuditLog,
  type UserRole,
} from "@/types";
import { formatDateTime, formatEnum, toPositiveInt } from "@/utils";

const PATHNAME = "/admin/audit-logs";
const PAGE_SIZE = 15;
const ROLES: UserRole[] = ["TENANT", "OWNER", "ADMIN", "SUPER_ADMIN"];
// "RoommateRequest" → "Roommate request"
const resourceLabel = (resource: string) =>
  formatEnum(resource.replace(/([a-z])([A-Z])/g, "$1_$2"));

// Actions that undo or block something read as warnings
const SERIOUS = /BLOCKED|DELETED|SUSPENDED|ARCHIVED|REJECTED|FAILED|REFUNDED/;

// Enum values read as words ("PENDING" → "Pending"); anything else as it is
const show = (value: unknown) => {
  if (value === null || value === undefined) return "—";
  if (typeof value !== "string") return JSON.stringify(value);
  return /^[A-Z_]+$/.test(value) ? formatEnum(value) : value;
};

// "status: Pending → Accepted" for every field the action changed
function Changes({ log }: { log: AuditLog }) {
  const keys = [
    ...new Set([
      ...Object.keys(log.previousData ?? {}),
      ...Object.keys(log.newData ?? {}),
    ]),
  ];
  if (keys.length === 0)
    return <span className="text-muted-foreground">—</span>;

  return (
    <ul className="space-y-0.5 text-xs">
      {keys.slice(0, 4).map((key) => (
        <li
          key={key}
          className="line-clamp-1"
          title={`${key}: ${show(log.previousData?.[key])} → ${show(log.newData?.[key])}`}
        >
          <span className="text-muted-foreground">{key}: </span>
          {log.previousData && key in log.previousData && (
            <>
              <span className="text-muted-foreground line-through">
                {show(log.previousData[key])}
              </span>{" "}
              →{" "}
            </>
          )}
          <span className="font-medium">{show(log.newData?.[key])}</span>
        </li>
      ))}
    </ul>
  );
}

const columns: DataTableColumn<AuditLog>[] = [
  {
    key: "when",
    header: "When",
    cell: (log) => (
      <span className="tabular-nums">{formatDateTime(log.createdAt)}</span>
    ),
  },
  {
    key: "who",
    header: "Who",
    cell: (log) =>
      log.actor ? (
        <div className="min-w-36">
          <p className="font-medium">{log.actor.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatEnum(log.actor.role)}
          </p>
        </div>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <Bot className="size-4" />
          System
        </span>
      ),
  },
  {
    key: "action",
    header: "Action",
    cell: (log) => (
      <Badge variant={SERIOUS.test(log.action) ? "warning" : "muted"} size="sm">
        {formatEnum(log.action)}
      </Badge>
    ),
  },
  {
    key: "resource",
    header: "Record",
    responsive: "hidden md:table-cell",
    cell: (log) => (
      <div>
        <p>{resourceLabel(log.resource)}</p>
        <p
          className="font-mono text-xs text-muted-foreground"
          title={log.resourceId}
        >
          …{log.resourceId.slice(-8)}
        </p>
      </div>
    ),
  },
  {
    key: "changes",
    header: "Change",
    className: "whitespace-normal",
    responsive: "hidden lg:table-cell",
    cell: (log) => (
      <div className="max-w-72">
        <Changes log={log} />
      </div>
    ),
  },
];

// Every recorded change, newest first; filter by record type, action and who did it (all in the URL)
export default function AuditTable() {
  const { get } = useUrlState();
  const resource = AUDIT_RESOURCES.find((value) => value === get("resource"));
  const action = AUDIT_ACTIONS.find((value) => value === get("action"));
  const actorRole = ROLES.find((value) => value === get("actorRole"));
  const filtered = Boolean(resource || action || actorRole);
  const query = useAuditLogs({
    resource,
    action,
    actorRole,
    page: toPositiveInt(get("page"), 1),
    limit: PAGE_SIZE,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  return (
    <ListView
      query={query}
      pathname={PATHNAME}
      noun={["entry", "entries"]}
      columns={columns}
      getRowId={(log) => log.id}
      toolbar={
        <ListToolbar>
          <UrlSelect
            urlKey="resource"
            label="Filter by record type"
            className="sm:w-56"
            options={[
              { value: "", label: "All records" },
              ...AUDIT_RESOURCES.map((value) => ({
                value,
                label: resourceLabel(value),
              })),
            ]}
          />
          <UrlSelect
            urlKey="action"
            label="Filter by action"
            className="sm:w-64"
            options={[
              { value: "", label: "All actions" },
              ...AUDIT_ACTIONS.map((value) => ({
                value,
                label: formatEnum(value),
              })),
            ]}
          />
          <UrlSelect
            urlKey="actorRole"
            label="Filter by who did it"
            className="sm:w-44"
            options={[
              { value: "", label: "Anyone" },
              ...ROLES.map((value) => ({ value, label: formatEnum(value) })),
            ]}
          />
        </ListToolbar>
      }
      empty={
        filtered ? (
          <FilteredEmptyState
            noun="entries"
            keys={["resource", "action", "actorRole"]}
          />
        ) : (
          <EmptyState
            icon={ScrollText}
            title="Nothing recorded yet"
            description="Moderation, bookings and payments are logged here as they happen."
          />
        )
      }
    />
  );
}
