"use client";

import { CalendarCheck, LogIn } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks";
import { getDashboardPath } from "@/utils";

// What the visitor can do next depends on who they are (the rest of the page is identical for everyone)
export default function ListingActions({
  hasAvailableRoom,
  roomsAnchor = "#rooms",
}: {
  hasAvailableRoom: boolean;
  roomsAnchor?: string;
}) {
  const pathname = usePathname();
  const { user, isTenant, isLoading } = useAuth();

  if (isLoading) {
    return <Skeleton className="h-14 w-full" />;
  }

  if (!user) {
    return (
      <div className="space-y-3">
        <Link
          href={`/login?redirect=${encodeURIComponent(pathname)}`}
          className={buttonVariants({ className: "w-full" })}
        >
          <LogIn />
          Log in to request a viewing
        </Link>
        <p className="text-center text-xs text-muted-foreground">
          New here?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:underline"
          >
            Create a free account
          </Link>
        </p>
      </div>
    );
  }

  if (isTenant) {
    return hasAvailableRoom ? (
      <div className="space-y-3">
        <a
          href={roomsAnchor}
          className={buttonVariants({ className: "w-full" })}
        >
          <CalendarCheck />
          Choose a room to view or apply
        </a>
        <p className="text-center text-xs text-muted-foreground">
          Viewings and applications are made for a specific room.
        </p>
      </div>
    ) : (
      <p className="rounded-xl bg-muted p-4 text-center text-sm text-muted-foreground">
        Every room here is taken right now. Check back later or browse other
        listings.
      </p>
    );
  }

  return (
    <div className="space-y-3 rounded-xl bg-muted p-4 text-center text-sm text-muted-foreground">
      <p>Viewings and applications are made by tenant accounts.</p>
      <Link
        href={getDashboardPath(user.role)}
        className="font-semibold text-primary hover:underline"
      >
        Go to your dashboard
      </Link>
    </div>
  );
}
