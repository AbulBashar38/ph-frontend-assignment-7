"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ROLE_ROUTES } from "@/routes";
import type { UserRole } from "@/types";
import { getDashboardPath } from "@/utils";
import NotificationBell from "./notification-bell";
import UserMenu from "./user-menu";

// Sticky top bar: sidebar toggle, the current section's name, notifications and the account menu
// Pages that aren't in a sidebar (Stripe's return pages)
const EXTRA_TITLES: [prefix: string, title: string][] = [
  ["/payment", "Payments"],
];

export default function DashboardHeader({ userRole }: { userRole: UserRole }) {
  const pathname = usePathname();
  const home = getDashboardPath(userRole);
  const items = ROLE_ROUTES[userRole].flatMap((group) => group.items);
  // The most specific sidebar entry that matches the current page
  const current = items
    .filter(
      (item) => pathname === item.url || pathname.startsWith(`${item.url}/`),
    )
    .sort((a, b) => b.url.length - a.url.length)[0];

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur-md sm:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-6" />
      <p className="min-w-0 flex-1 truncate font-heading text-lg font-semibold">
        {EXTRA_TITLES.find(([prefix]) => pathname.startsWith(prefix))?.[1] ??
          current?.title ??
          "Dashboard"}
      </p>
      <NotificationBell allHref={`${home}/notifications`} />
      <UserMenu />
    </header>
  );
}
