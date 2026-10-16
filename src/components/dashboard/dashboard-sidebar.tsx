"use client";

import { Building2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ROLE_ROUTES } from "@/routes";
import type { UserRole } from "@/types";
import { getDashboardPath } from "@/utils";

export default function DashboardSidebar({ userRole }: { userRole: UserRole }) {
  const pathname = usePathname();
  const home = getDashboardPath(userRole);

  // The overview link is only active on the overview itself; other links also match their sub-pages
  const isActive = (url: string) =>
    url === home
      ? pathname === url
      : pathname === url || pathname.startsWith(`${url}/`);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 justify-center border-b">
        <Link href="/" className="flex items-center gap-2.5 px-1.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="size-4" />
          </span>
          <span className="font-heading text-lg font-bold tracking-tight group-data-[collapsible=icon]:hidden">
            Bari<span className="text-primary">Basa</span>
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {ROLE_ROUTES[userRole].map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      render={<Link href={item.url} />}
                      isActive={isActive(item.url)}
                      tooltip={item.title}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
