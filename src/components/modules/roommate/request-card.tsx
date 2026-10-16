"use client";

import { formatDistanceToNow } from "date-fns";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/shared/confirm-dialog";
import PersonCell from "@/components/shared/person-cell";
import StatusBadge from "@/components/shared/status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { useUpdateRoommateRequestStatus } from "@/hooks";
import type { RoommateRequest, RoommateRequestStatus } from "@/types";
import { getErrorMessage } from "@/utils";
import ContactLinks from "./contact-links";

// A request I received (accept / decline) or sent (cancel); contact details appear once accepted
export default function RequestCard({
  request,
  direction,
}: {
  request: RoommateRequest;
  direction: "received" | "sent";
}) {
  const mutation = useUpdateRoommateRequestStatus();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const person = direction === "received" ? request.sender : request.receiver;
  const firstName = person.name.split(" ")[0];
  const pending = request.status === "PENDING";

  const respond = (
    status: Exclude<RoommateRequestStatus, "PENDING">,
    message: string,
  ) =>
    mutation.mutate(
      { id: request.id, status },
      {
        onSuccess: () => {
          toast.success(message);
          setConfirmCancel(false);
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );

  return (
    <li className="space-y-4 rounded-2xl border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PersonCell
          name={person.name}
          imageUrl={person.imageUrl}
          detail={person.occupation ?? undefined}
        />
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(request.createdAt), {
              addSuffix: true,
            })}
          </span>
          <StatusBadge status={request.status} />
        </div>
      </div>

      {request.message && (
        <p className="rounded-xl bg-muted/50 p-3 text-sm whitespace-pre-line">
          {request.message}
        </p>
      )}

      {request.status === "ACCEPTED" && <ContactLinks person={person} />}

      <div className="flex flex-wrap gap-2">
        {person.roommateProfile && (
          <Link
            href={`/dashboard/roommate/profile/${person.roommateProfile.id}`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            View profile
          </Link>
        )}
        {pending && direction === "received" && (
          <>
            <Button
              size="sm"
              disabled={mutation.isPending}
              onClick={() =>
                respond(
                  "ACCEPTED",
                  `You're connected with ${firstName}. Their contact details are now visible`,
                )
              }
            >
              <Check />
              Accept
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={mutation.isPending}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => respond("DECLINED", "Request declined")}
            >
              <X />
              Decline
            </Button>
          </>
        )}
        {pending && direction === "sent" && (
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setConfirmCancel(true)}
          >
            <X />
            Cancel request
          </Button>
        )}
      </div>

      <ConfirmDialog
        open={confirmCancel}
        onOpenChange={setConfirmCancel}
        title={`Cancel your request to ${firstName}?`}
        description="You can send a new one later."
        confirmLabel="Cancel request"
        destructive
        pending={mutation.isPending}
        onConfirm={() => respond("CANCELLED", "Request cancelled")}
      />
    </li>
  );
}
