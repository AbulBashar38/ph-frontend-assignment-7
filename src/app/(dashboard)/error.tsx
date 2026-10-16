"use client";

import { LayoutDashboard, RefreshCw, ServerCrash } from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/shared/empty-state";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/hooks";
import { getDashboardPath } from "@/utils";

// Shown inside the dashboard shell when a dashboard page fails to render
export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { user } = useAuth();

  return (
    <EmptyState
      icon={ServerCrash}
      title="This page didn't load"
      description="Something went wrong while loading it. Try again, or head back to your dashboard."
      action={
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>
            <RefreshCw />
            Try again
          </Button>
          {user && (
            <Link
              href={getDashboardPath(user.role)}
              className={buttonVariants({ variant: "outline" })}
            >
              <LayoutDashboard />
              Dashboard
            </Link>
          )}
        </div>
      }
    />
  );
}
