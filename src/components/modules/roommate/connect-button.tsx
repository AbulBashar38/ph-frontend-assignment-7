"use client";

import { Check, Clock, Inbox, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import SendRequestDialog from "./send-request-dialog";
import type { ConnectionState } from "./use-connection-state";

// The one next step with this person: connect, wait, answer their request, or see the connection
export default function ConnectButton({
  state,
  profileId,
  name,
  size = "sm",
}: {
  state: ConnectionState;
  profileId: string;
  name: string;
  size?: "sm" | "default";
}) {
  const [open, setOpen] = useState(false);

  if (state === "connected") {
    return (
      <Link
        href="/dashboard/roommate/connections"
        className={buttonVariants({ variant: "outline", size })}
      >
        <Check />
        Connected
      </Link>
    );
  }
  if (state === "sent") {
    return (
      <Button variant="outline" size={size} disabled>
        <Clock />
        Request sent
      </Button>
    );
  }
  if (state === "received") {
    return (
      <Link
        href="/dashboard/roommate/requests"
        className={buttonVariants({ size })}
      >
        <Inbox />
        Answer request
      </Link>
    );
  }

  return (
    <>
      <Button size={size} onClick={() => setOpen(true)}>
        <UserPlus />
        Connect
      </Button>
      <SendRequestDialog
        open={open}
        onOpenChange={setOpen}
        profileId={profileId}
        name={name}
      />
    </>
  );
}
