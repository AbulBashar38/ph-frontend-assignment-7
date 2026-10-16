import {
  Bell,
  Building2,
  CalendarCheck,
  CreditCard,
  FileText,
  KeyRound,
  LayoutDashboard,
  LineChart,
  PlusSquare,
  UserRound,
} from "lucide-react";
import type { SidebarItems } from "@/types";

const prefix = "/owner";

export const ownerRoutes: SidebarItems = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: prefix, icon: LayoutDashboard },
      { title: "Earnings", url: `${prefix}/earnings`, icon: LineChart },
      { title: "Notifications", url: `${prefix}/notifications`, icon: Bell },
    ],
  },
  {
    title: "Listings",
    items: [
      { title: "My properties", url: `${prefix}/properties`, icon: Building2 },
      {
        title: "Add property",
        url: `${prefix}/properties/new`,
        icon: PlusSquare,
      },
    ],
  },
  {
    title: "Tenants",
    items: [
      {
        title: "Viewing requests",
        url: `${prefix}/viewings`,
        icon: CalendarCheck,
      },
      { title: "Applications", url: `${prefix}/applications`, icon: FileText },
      { title: "Rentals", url: `${prefix}/rentals`, icon: KeyRound },
      { title: "Payments", url: `${prefix}/payments`, icon: CreditCard },
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
