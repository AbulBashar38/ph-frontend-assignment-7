"use client";

import { Users } from "lucide-react";
import type { DataTableColumn } from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import FilteredEmptyState from "@/components/shared/filtered-empty-state";
import ListToolbar from "@/components/shared/list-toolbar";
import ListView from "@/components/shared/list-view";
import PersonCell from "@/components/shared/person-cell";
import SearchInput from "@/components/shared/search-input";
import StatusBadge from "@/components/shared/status-badge";
import UrlSelect from "@/components/shared/url-select";
import UrlTabs from "@/components/shared/url-tabs";
import { Badge } from "@/components/ui/badge";
import { useUrlState, useUsers } from "@/hooks";
import type { User, UserRole, UserStatus } from "@/types";
import { formatDate, formatEnum, toPositiveInt } from "@/utils";
import UserRowActions from "./user-row-actions";

const PATHNAME = "/admin/users";
const PAGE_SIZE = 12;
const ROLES: UserRole[] = ["TENANT", "OWNER", "ADMIN", "SUPER_ADMIN"];
const STATUSES: UserStatus[] = ["ACTIVE", "BLOCKED"];

const columns: DataTableColumn<User>[] = [
  {
    key: "user",
    header: "User",
    cell: (user) => (
      <div className="min-w-52">
        <PersonCell
          name={user.name}
          imageUrl={user.imageUrl}
          detail={user.email}
        />
      </div>
    ),
  },
  {
    key: "role",
    header: "Role",
    cell: (user) => (
      <Badge
        variant={
          user.role === "OWNER" || user.role === "TENANT"
            ? "muted"
            : "highlight"
        }
        size="sm"
      >
        {formatEnum(user.role)}
      </Badge>
    ),
  },
  {
    key: "phone",
    header: "Phone",
    responsive: "hidden xl:table-cell",
    cell: (user) =>
      user.phone ?? <span className="text-muted-foreground">—</span>,
  },
  {
    key: "sign-in",
    header: "Sign-in",
    responsive: "hidden lg:table-cell",
    cell: (user) => (
      <span className="text-sm">
        {user.authProvider === "GOOGLE" ? "Google" : "Email"}
        {!user.emailVerified && (
          <span className="block text-xs text-muted-foreground">
            not verified
          </span>
        )}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    className: "whitespace-normal",
    cell: (user) => (
      <div className="space-y-1">
        <StatusBadge status={user.status} />
        {user.status === "BLOCKED" && user.blockedReason && (
          <p
            className="line-clamp-2 max-w-48 text-xs text-muted-foreground"
            title={user.blockedReason}
          >
            {user.blockedReason}
          </p>
        )}
      </div>
    ),
  },
  {
    key: "joined",
    header: "Joined",
    responsive: "hidden md:table-cell",
    cell: (user) => (
      <span className="text-muted-foreground">
        {formatDate(user.createdAt)}
      </span>
    ),
  },
  {
    key: "actions",
    header: <span className="sr-only">Actions</span>,
    className: "text-right",
    cell: (user) => <UserRowActions user={user} />,
  },
];

// Every account: search by name, email or phone; filter by role (?role) and status (?status)
export default function UserTable() {
  const { get } = useUrlState();
  const role = ROLES.find((value) => value === get("role"));
  const status = STATUSES.find((value) => value === get("status"));
  const searchTerm = get("searchTerm") || undefined;
  const query = useUsers({
    role,
    status,
    searchTerm,
    page: toPositiveInt(get("page"), 1),
    limit: PAGE_SIZE,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  return (
    <ListView
      query={query}
      pathname={PATHNAME}
      noun={["user", "users"]}
      columns={columns}
      getRowId={(user) => user.id}
      toolbar={
        <ListToolbar
          tabs={
            <UrlTabs
              urlKey="role"
              label="Filter by role"
              options={[
                { value: "", label: "Everyone" },
                { value: "TENANT", label: "Tenants" },
                { value: "OWNER", label: "Owners" },
                { value: "ADMIN", label: "Admins" },
              ]}
            />
          }
        >
          <div className="sm:w-72">
            <SearchInput
              placeholder="Name, email or phone…"
              aria-label="Search users"
            />
          </div>
          <UrlSelect
            urlKey="status"
            label="Filter by status"
            className="sm:w-44"
            options={[
              { value: "", label: "Any status" },
              { value: "ACTIVE", label: "Active" },
              { value: "BLOCKED", label: "Blocked" },
            ]}
          />
        </ListToolbar>
      }
      empty={
        role || status || searchTerm ? (
          <FilteredEmptyState
            noun="users"
            keys={["role", "status", "searchTerm"]}
          />
        ) : (
          <EmptyState
            icon={Users}
            title="No users yet"
            description="New sign-ups appear here."
          />
        )
      }
    />
  );
}
