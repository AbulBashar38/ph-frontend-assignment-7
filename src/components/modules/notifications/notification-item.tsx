"use client";

import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  CalendarCheck,
  CreditCard,
  FileText,
  KeyRound,
  type LucideIcon,
  ShieldAlert,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth, useMarkNotificationRead } from "@/hooks";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types";
import { getNotificationHref } from "@/utils";

const ICONS: [prefix: string, icon: LucideIcon][] = [
  ["VIEWING_", CalendarCheck],
  ["APPLICATION_", FileText],
  ["RENTAL_", KeyRound],
  ["PAYMENT_", CreditCard],
  ["RENT_", CreditCard],
  ["LISTING_", ShieldAlert],
  ["ACCOUNT_", ShieldAlert],
  ["ROOMMATE_", Users],
];

const iconFor = (notification: Notification) =>
  ICONS.find(([prefix]) => notification.type.startsWith(prefix))?.[1] ?? Bell;

// One notification: clicking marks it read (instantly) and opens what it's about
export default function NotificationItem({
  notification,
  compact = false,
  onOpen,
}: {
  notification: Notification;
  // The bell's dropdown uses a denser layout
  compact?: boolean;
  onOpen?: () => void;
}) {
  const router = useRouter();
  const { role } = useAuth();
  const { mutate: markRead } = useMarkNotificationRead();
  const Icon = iconFor(notification);
  const href = role ? getNotificationHref(notification, role) : null;

  return (
    <button
      type="button"
      onClick={() => {
        if (!notification.isRead) markRead(notification.id);
        if (href) {
          onOpen?.();
          router.push(href);
        }
      }}
      className={cn(
        "flex w-full gap-3 text-left transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none",
        compact ? "px-4 py-3" : "rounded-2xl border p-4 sm:p-5",
        !notification.isRead && "bg-accent/40",
        !compact && !notification.isRead && "border-primary/20",
      )}
    >
      <span
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-xl bg-accent text-primary",
          compact ? "size-9" : "size-11",
        )}
      >
        <Icon className={compact ? "size-4" : "size-5"} />
        {!notification.isRead && (
          <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full border-2 border-background bg-primary">
            <span className="sr-only">Unread</span>
          </span>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block font-medium",
            compact ? "text-sm" : "text-[15px]",
          )}
        >
          {notification.title}
        </span>
        <span
          className={cn(
            "mt-0.5 block text-muted-foreground",
            compact ? "line-clamp-2 text-xs" : "text-sm",
          )}
        >
          {notification.message}
        </span>
        <span className="mt-1 block text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </span>
      </span>
    </button>
  );
}
