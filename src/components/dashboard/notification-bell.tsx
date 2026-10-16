"use client";

import { Bell, CheckCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import NotificationItem from "@/components/modules/notifications/notification-item";
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
  useNotifications,
  useUnreadNotificationCount,
} from "@/hooks";

// Bell with the unread count; opens the latest notifications (marking read updates instantly)
export default function NotificationBell({ allHref }: { allHref: string }) {
  const { data: countData } = useUnreadNotificationCount();
  const { data, isPending } = useNotifications({ limit: 6 });
  const [open, setOpen] = useState(false);
  const { mutate: markAllRead } = useMarkAllNotificationsRead();

  const unread = countData?.data.unreadCount ?? 0;
  const notifications = data?.data ?? [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
                  <NotificationItem
                    notification={notification}
                    compact
                    onOpen={() => setOpen(false)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t p-2">
          <Link
            href={allHref}
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2 text-center text-sm font-medium text-primary hover:bg-muted"
          >
            See all notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
