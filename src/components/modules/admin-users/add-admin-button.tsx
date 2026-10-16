"use client";

import { UserPlus } from "lucide-react";
import { useState } from "react";
import CreateAdminForm from "@/components/form/create-admin-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks";

// Only the super admin manages other admins
export default function AddAdminButton() {
  const { role } = useAuth();
  const [open, setOpen] = useState(false);

  if (role !== "SUPER_ADMIN") return null;

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <UserPlus />
        Add admin
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-6 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              Add an admin
            </DialogTitle>
            <DialogDescription>
              Admins can moderate users and listings and see every booking and
              payment.
            </DialogDescription>
          </DialogHeader>
          {open && <CreateAdminForm onDone={() => setOpen(false)} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
