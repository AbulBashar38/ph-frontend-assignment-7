import type { SidebarItems, UserRole } from "@/types";
import { adminRoutes } from "./admin.routes";
import { ownerRoutes } from "./owner.routes";
import { tenantRoutes } from "./tenant.routes";

export { adminRoutes, ownerRoutes, tenantRoutes };

export const ROLE_ROUTES: Record<UserRole, SidebarItems> = {
  TENANT: tenantRoutes,
  OWNER: ownerRoutes,
  ADMIN: adminRoutes,
  SUPER_ADMIN: adminRoutes,
};
