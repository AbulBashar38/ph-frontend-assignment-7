"use client";

import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUrlState } from "@/hooks";
import EmptyState from "./empty-state";

// Nothing matches the current filters: say so and offer to clear them
export default function FilteredEmptyState({
  noun,
  keys,
}: {
  noun: string;
  keys: string[];
}) {
  const { clear } = useUrlState();

  return (
    <EmptyState
      icon={SearchX}
      title={`No ${noun} match`}
      description="Try another status or filter."
      action={
        <Button variant="outline" onClick={() => clear(keys)}>
          Clear filters
        </Button>
      }
    />
  );
}
