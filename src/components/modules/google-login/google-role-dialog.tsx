"use client";

import { useState } from "react";
import RoleChoice from "@/components/auth/role-choice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import type { RegisterRole } from "@/types";

// Shown once, when a Google account signs in for the first time and we need to know its role
export default function GoogleRoleDialog({
  open,
  pending,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  pending: boolean;
  onCancel: () => void;
  onConfirm: (role: RegisterRole) => void;
}) {
  const [role, setRole] = useState<RegisterRole | null>(null);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => !next && !pending && onCancel()}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Welcome to BariBasa!</DialogTitle>
          <DialogDescription>
            This is your first time here. Tell us what you&apos;d like to do so
            we can set up the right account. You can&apos;t change this later.
          </DialogDescription>
        </DialogHeader>

        <RoleChoice
          value={role}
          onChange={setRole}
          className="sm:grid-cols-2"
        />

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={pending}>
            Cancel
          </Button>
          <Button
            onClick={() => role && onConfirm(role)}
            disabled={!role || pending}
          >
            {pending ? (
              <>
                <Spinner /> Creating account
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
