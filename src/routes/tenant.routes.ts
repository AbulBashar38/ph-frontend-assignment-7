import {
  Bell,
  CalendarCheck,
  CreditCard,
  FileText,
  HeartHandshake,
  Home,
  KeyRound,
  LayoutDashboard,
  Search,
  UserRound,
  Users,
} from "lucide-react";
import type { SidebarItems } from "@/types";

const prefix = "/dashboard";

export const tenantRoutes: SidebarItems = [
  {
    title: "Overview",
    items: [
      { title: "My activity", url: prefix, icon: LayoutDashboard },
      { title: "Notifications", url: `${prefix}/notifications`, icon: Bell },
    ],
  },
  {
    title: "Housing",
    items: [
      { title: "Find a place", url: "/properties", icon: Search },
      { title: "Viewings", url: `${prefix}/viewings`, icon: CalendarCheck },
      { title: "Applications", url: `${prefix}/applications`, icon: FileText },
      { title: "Rentals", url: `${prefix}/rentals`, icon: KeyRound },
      { title: "Payments", url: `${prefix}/payments`, icon: CreditCard },
    ],
  },
  {
    title: "Roommates",
    items: [
      {
        title: "My profile",
        url: `${prefix}/roommate/profile`,
        icon: UserRound,
      },
      { title: "Matches", url: `${prefix}/roommate/matches`, icon: Users },
      {
        title: "Requests",
        url: `${prefix}/roommate/requests`,
        icon: HeartHandshake,
      },
      {
        title: "Connections",
        url: `${prefix}/roommate/connections`,
        icon: Home,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Profile & settings",
        url: `${prefix}/profile`,
        icon: UserRound,
      },
    ],
  },
];
