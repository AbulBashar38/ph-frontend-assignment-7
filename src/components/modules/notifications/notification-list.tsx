"use client";

import { BellOff, CheckCheck } from "lucide-react";
import EmptyState from "@/components/shared/empty-state";
import ListFooter from "@/components/shared/list-footer";
import QueryError from "@/components/shared/query-error";
import UrlTabs from "@/components/shared/url-tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useMarkAllNotificationsRead,
  useNotifications,
  usePageSize,
  useUnreadNotificationCount,
  useUrlState,
} from "@/hooks";
import { toPositiveInt } from "@/utils";
import NotificationItem from "./notification-item";

const PAGE_SIZE = 15;

export function NotificationListSkeleton() {
  return (
    <div className="space-y-3">
      {["a", "b", "c", "d"].map((key) => (
        <Skeleton key={key} className="h-24 w-full rounded-2xl" />
      ))}
    </div>
  );
}

// Every notification, newest first; ?filter=unread and ?page live in the URL
export default function NotificationList({ pathname }: { pathname: string }) {
  const pageSize = usePageSize(PAGE_SIZE);
  const { get } = useUrlState();
  const unreadOnly = get("filter") === "unread";
  const page = toPositiveInt(get("page"), 1);
  const query = useNotifications(
    {
      isRead: unreadOnly ? "false" : undefined,
      page,
      limit: pageSize,
      sortBy: "createdAt",
      sortOrder: "desc",
    },
    { keepPrevious: true },
  );
  const { data: countData } = useUnreadNotificationCount();
  const { mutate: markAllRead, isPending } = useMarkAllNotificationsRead();
  const unread = countData?.data.unreadCount ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <UrlTabs
          urlKey="filter"
          label="Show"
          options={[
            { value: "", label: "All" },
            {
              value: "unread",
              label: unread ? `Unread (${unread})` : "Unread",
            },
          ]}
        />
        {unread > 0 && (
          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => markAllRead(undefined)}
          >
            <CheckCheck />
            Mark all read
          </Button>
        )}
      </div>

      {query.isPending ? (
        <NotificationListSkeleton />
      ) : query.isError ? (
        <QueryError error={query.error} onRetry={() => query.refetch()} />
      ) : query.data.data.length === 0 ? (
        <EmptyState
          icon={BellOff}
          title={unreadOnly ? "You're all caught up" : "No notifications yet"}
          description={
            unreadOnly
              ? "Nothing unread. New updates show up here and on the bell."
              : "Updates about viewings, applications, rentals and payments will show up here."
          }
        />
      ) : (
        <ul
          className={
            query.isPlaceholderData
              ? "space-y-3 opacity-60 transition-opacity"
              : "space-y-3"
          }
        >
          {query.data.data.map((notification) => (
            <li key={notification.id}>
              <NotificationItem notification={notification} />
            </li>
          ))}
        </ul>
      )}

      {query.data && (
        <ListFooter
          meta={query.data.meta}
          pathname={pathname}
          noun={["notification", "notifications"]}
        />
      )}
    </div>
  );
}
