import {
  BarChart3,
  Building2,
  CreditCard,
  FileText,
  KeyRound,
  ScrollText,
  UserRound,
  Users,
} from "lucide-react";
import type { SidebarItems } from "@/types";

const prefix = "/admin";

export const adminRoutes: SidebarItems = [
  {
    title: "Overview",
    items: [{ title: "Analytics", url: prefix, icon: BarChart3 }],
  },
  {
    title: "Management",
    items: [
      { title: "Users", url: `${prefix}/users`, icon: Users },
      { title: "Properties", url: `${prefix}/properties`, icon: Building2 },
    ],
  },
  {
    title: "Monitoring",
    items: [
      { title: "Applications", url: `${prefix}/applications`, icon: FileText },
      { title: "Rentals", url: `${prefix}/rentals`, icon: KeyRound },
      { title: "Payments", url: `${prefix}/payments`, icon: CreditCard },
      { title: "Audit logs", url: `${prefix}/audit-logs`, icon: ScrollText },
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
