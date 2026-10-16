"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth, useMounted } from "@/hooks";
import { cn } from "@/lib/utils";
import { SHORTLIST_LIMIT, useShortlistStore } from "@/store/shortlist.store";

// Save a property to compare later. Owners and admins don't get it; guests can save and log in later.
export default function ShortlistButton({
  propertyId,
  title,
  variant = "overlay",
}: {
  propertyId: string;
  title: string;
  // overlay: round icon over a photo; inline: labelled outline button
  variant?: "overlay" | "inline";
}) {
  const router = useRouter();
  const mounted = useMounted();
  const { user, isTenant } = useAuth();
  const saved = useShortlistStore((state) => state.ids.includes(propertyId));
  const add = useShortlistStore((state) => state.add);
  const remove = useShortlistStore((state) => state.remove);

  // The saved list lives in this browser, so show it only after hydration
  if (!mounted || (user && !isTenant)) return null;

  const toggle = () => {
    if (saved) {
      remove(propertyId);
      toast.success("Removed from your shortlist");
      return;
    }
    if (!add(propertyId)) {
      toast.error(
        `Your shortlist is full (${SHORTLIST_LIMIT}). Remove one to add another`,
      );
      return;
    }
    toast.success("Saved to your shortlist", {
      action: {
        label: "Compare",
        onClick: () => router.push("/dashboard/shortlist"),
      },
    });
  };

  const label = saved
    ? `Remove ${title} from your shortlist`
    : `Save ${title} to your shortlist`;

  if (variant === "inline") {
    return (
      <Button
        variant="outline"
        aria-pressed={saved}
        onClick={toggle}
        className="w-full"
      >
        <Heart className={cn(saved && "fill-current text-destructive")} />
        {saved ? "Saved to shortlist" : "Save to shortlist"}
      </Button>
    );
  }

  return (
    <Button
      variant="inverse"
      size="icon-xs"
      shape="pill"
      aria-label={label}
      aria-pressed={saved}
      onClick={toggle}
      className="shadow-md"
    >
      <Heart className={cn(saved && "fill-current text-destructive")} />
    </Button>
  );
}
