"use client";

import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadNotificationCount,
} from "@/hooks";
import { cn } from "@/lib/utils";

// Bell with the unread count; opens the latest notifications (marking read updates instantly)
export default function NotificationBell({ allHref }: { allHref: string }) {
  const { data: countData } = useUnreadNotificationCount();
  const { data, isPending } = useNotifications({ limit: 6 });
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead } = useMarkAllNotificationsRead();

  const unread = countData?.data.unreadCount ?? 0;
  const notifications = data?.data ?? [];

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={
              unread > 0 ? `Notifications, ${unread} unread` : "Notifications"
            }
            className="relative"
          />
        }
      >
        <Bell />
        {unread > 0 && (
          <Badge
            variant="highlight"
            size="sm"
            className="absolute -top-0.5 -right-0.5 h-5 min-w-5 px-1 tabular-nums"
          >
            {unread > 9 ? "9+" : unread}
          </Badge>
        )}
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-[min(24rem,calc(100vw-2rem))] p-0"
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="font-semibold">Notifications</p>
          {unread > 0 && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => markAllRead(undefined)}
            >
              <CheckCheck />
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {isPending ? (
            <div className="space-y-3 p-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : notifications.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              You&apos;re all caught up.
            </p>
          ) : (
            <ul className="divide-y">
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <button
                    type="button"
                    onClick={() =>
                      !notification.isRead && markRead(notification.id)
                    }
                    className={cn(
                      "flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60",
                      !notification.isRead && "bg-accent/40",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-1.5 size-2 shrink-0 rounded-full",
                        notification.isRead ? "bg-transparent" : "bg-primary",
                      )}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">
                        {notification.title}
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">
                        {notification.message}
                      </span>
                      <span className="mt-1 block text-[11px] text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t p-2">
          <Link
            href={allHref}
            className="block rounded-lg px-3 py-2 text-center text-sm font-medium text-primary hover:bg-muted"
          >
            See all notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
