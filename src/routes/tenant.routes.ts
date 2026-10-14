import type { SidebarItems } from "@/types";

const prefix = "/dashboard";

export const tenantRoutes: SidebarItems = [
  {
    title: "Overview",
    items: [
      { title: "My Activity", url: prefix },
      { title: "Notifications", url: `${prefix}/notifications` },
    ],
  },
  {
    title: "Housing",
    items: [
      { title: "Shortlist", url: `${prefix}/shortlist` },
      { title: "Viewings", url: `${prefix}/viewings` },
      { title: "Applications", url: `${prefix}/applications` },
      { title: "Rentals", url: `${prefix}/rentals` },
      { title: "Payments", url: `${prefix}/payments` },
    ],
  },
  {
    title: "Roommates",
    items: [
      { title: "My Roommate Profile", url: `${prefix}/roommate/profile` },
      { title: "Matches", url: `${prefix}/roommate/matches` },
      { title: "Requests", url: `${prefix}/roommate/requests` },
      { title: "Connections", url: `${prefix}/roommate/connections` },
    ],
  },
  {
    title: "Account",
    items: [{ title: "Profile & Settings", url: `${prefix}/profile` }],
  },
];
