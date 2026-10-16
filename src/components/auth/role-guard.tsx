"use client";

import { usePathname, useRouter } from "next/navigation";
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
  const pathname = usePathname();
  const { data, isPending, isError } = useGetMe();
  const user = data?.data;

  useEffect(() => {
    if (isPending) return;
    if (isError || !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isPending, isError, user, router, pathname]);

  if (isPending) return <AuthLoading />;
  if (isError || !user) return <AuthLoading label="Redirecting to login" />;
  if (!roles.includes(user.role)) {
    return <AccessDenied homeHref={getDashboardPath(user.role)} />;
  }

  return <>{children}</>;
}
