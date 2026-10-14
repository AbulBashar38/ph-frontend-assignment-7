import type { UserRole } from "@/types";

// "Admin" always means ADMIN and SUPER_ADMIN, same as the backend
export const ADMIN_ROLES: readonly UserRole[] = ["ADMIN", "SUPER_ADMIN"];

export function isAdminRole(role: UserRole) {
  return ADMIN_ROLES.includes(role);
}

// Home page of each role's dashboard area
export function getDashboardPath(role: UserRole) {
  if (isAdminRole(role)) {
    return "/admin";
  }
  return role === "OWNER" ? "/owner" : "/dashboard";
}
