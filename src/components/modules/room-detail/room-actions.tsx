"use client";

import { CalendarCheck, FileSignature, LogIn } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";
import ApplyForm from "@/components/form/apply-form";
import RequestViewingForm from "@/components/form/request-viewing-form";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks";
import type { RoomStatus } from "@/types";
import { getDashboardPath } from "@/utils";

type Panel = "viewing" | "apply" | null;

// Request a viewing or apply for one room; what's offered depends on who is looking
export default function RoomActions({
  roomId,
  roomName,
  propertyId,
  status,
  maxOccupants,
  monthlyRent,
}: {
  roomId: string;
  roomName: string;
  propertyId: string;
  status: RoomStatus;
  maxOccupants: number;
  monthlyRent: number;
}) {
  const pathname = usePathname();
  const { user, isTenant, isLoading } = useAuth();
  const [panel, setPanel] = useState<Panel>(null);
  const isAvailable = status === "AVAILABLE";

  if (isLoading) {
    return <Skeleton className="h-30 w-full" />;
  }

  if (!user) {
    return (
      <div className="space-y-3">
        <Link
          href={`/login?redirect=${encodeURIComponent(pathname)}`}
          className={buttonVariants({ className: "w-full" })}
        >
          <LogIn />
          Log in to view or apply
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

  if (!isTenant) {
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

  const dialog = (
    open: boolean,
    title: string,
    description: string,
    body: ReactNode,
  ) => (
    <Dialog open={open} onOpenChange={(next) => !next && setPanel(null)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {body}
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-3">
      <Button
        className="w-full"
        disabled={!isAvailable}
        onClick={() => setPanel("apply")}
      >
        <FileSignature />
        Apply for this room
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setPanel("viewing")}
      >
        <CalendarCheck />
        Request a viewing
      </Button>
      {!isAvailable && (
        <p className="text-center text-xs text-muted-foreground">
          This room isn&apos;t taking applications right now.
        </p>
      )}

      {dialog(
        panel === "viewing",
        "Request a viewing",
        `Choose when you'd like to see ${roomName}.`,
        <RequestViewingForm
          propertyId={propertyId}
          roomId={roomId}
          onDone={() => setPanel(null)}
        />,
      )}
      {dialog(
        panel === "apply",
        `Apply for ${roomName}`,
        "Tell the owner when you'd like to move in and who will live here.",
        <ApplyForm
          roomId={roomId}
          maxOccupants={maxOccupants}
          monthlyRent={monthlyRent}
          onDone={() => setPanel(null)}
        />,
      )}
    </div>
  );
}
