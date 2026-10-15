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

// Where to send a user after login: the requested page if it's a safe in-app path inside their own area,
// otherwise their dashboard home
export function getPostLoginPath(role: UserRole, redirect?: string | null) {
  const home = getDashboardPath(role);
  const isInternal =
    !!redirect && redirect.startsWith("/") && !redirect.startsWith("//");
  const isPublicOrOwnArea =
    !!redirect &&
    !["/dashboard", "/owner", "/admin"].some(
      (area) => redirect.startsWith(area) && !redirect.startsWith(home),
    );

  return isInternal && isPublicOrOwnArea ? redirect : home;
}
