"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useGetMe } from "@/hooks";
import type { UserRole } from "@/types";
import { getDashboardPath } from "@/utils";
import AccessDenied from "./access-denied";
import AuthLoading from "./auth-loading";

// Second line of defence after proxy.ts: confirms the session with the API and the role on the client
export default function RoleGuard({
  children,
  roles,
}: {
  children: ReactNode;
  roles: UserRole[];
}) {
  const router = useRouter();
  const { data, isPending, isError } = useGetMe();
  const user = data?.data;

  useEffect(() => {
    if (isPending) return;
    if (isError || !user) {
      // Read at redirect time instead of usePathname(), which would block prerendering of dynamic routes
      const back = window.location.pathname + window.location.search;
      router.replace(`/login?redirect=${encodeURIComponent(back)}`);
    }
  }, [isPending, isError, user, router]);

  if (isPending) return <AuthLoading />;
  if (isError || !user) return <AuthLoading label="Redirecting to login" />;
  if (!roles.includes(user.role)) {
    return <AccessDenied homeHref={getDashboardPath(user.role)} />;
  }

  return <>{children}</>;
}
