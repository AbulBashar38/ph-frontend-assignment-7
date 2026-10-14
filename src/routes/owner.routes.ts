import type { SidebarItems } from "@/types";

const prefix = "/owner";

export const ownerRoutes: SidebarItems = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: prefix },
      { title: "Earnings", url: `${prefix}/earnings` },
      { title: "Notifications", url: `${prefix}/notifications` },
    ],
  },
  {
    title: "Listings",
    items: [
      { title: "My Properties", url: `${prefix}/properties` },
      { title: "Add Property", url: `${prefix}/properties/new` },
    ],
  },
  {
    title: "Tenants",
    items: [
      { title: "Viewing Requests", url: `${prefix}/viewings` },
      { title: "Applications", url: `${prefix}/applications` },
      { title: "Rentals", url: `${prefix}/rentals` },
      { title: "Payments", url: `${prefix}/payments` },
    ],
  },
  {
    title: "Account",
    items: [{ title: "Profile & Settings", url: `${prefix}/profile` }],
  },
];
