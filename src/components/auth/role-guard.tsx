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
  const { data, isPending, isError, isFetching } = useGetMe();
  const user = data?.data;
  // A cached "signed out" answer (from before a login) is still being re-checked: wait, don't redirect yet
  const checking = isPending || (!user && isFetching);

  useEffect(() => {
    if (checking) return;
    if (isError || !user) {
      // Read at redirect time instead of usePathname(), which would block prerendering of dynamic routes
      const back = window.location.pathname + window.location.search;
      router.replace(`/login?redirect=${encodeURIComponent(back)}`);
    }
  }, [checking, isError, user, router]);

  // Back/forward can restore a frozen snapshot of this page (bfcache) after signing out; reload it so the
  // server checks the session again (proxy.ts sends a signed-out visitor to /login)
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) window.location.reload();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  if (checking) return <AuthLoading />;
  if (isError || !user) return <AuthLoading label="Redirecting to login" />;
  if (!roles.includes(user.role)) {
    return <AccessDenied homeHref={getDashboardPath(user.role)} />;
  }

  return <>{children}</>;
}
