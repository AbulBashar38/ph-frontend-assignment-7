import type { SidebarItems } from "@/types";

const prefix = "/admin";

export const adminRoutes: SidebarItems = [
  {
    title: "Overview",
    items: [{ title: "Analytics", url: prefix }],
  },
  {
    title: "Management",
    items: [
      { title: "Users", url: `${prefix}/users` },
      { title: "Properties", url: `${prefix}/properties` },
    ],
  },
  {
    title: "Monitoring",
    items: [
      { title: "Applications", url: `${prefix}/applications` },
      { title: "Rentals", url: `${prefix}/rentals` },
      { title: "Payments", url: `${prefix}/payments` },
      { title: "Audit Logs", url: `${prefix}/audit-logs` },
    ],
  },
  {
    title: "Account",
    items: [{ title: "Profile & Settings", url: `${prefix}/profile` }],
  },
];
