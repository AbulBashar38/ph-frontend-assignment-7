"use client";

import { useSearchParams } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useNavigationStore } from "@/store/navigation.store";

// Fades the current results and shows "Updating…" while new results for changed filters are on their way
export default function PendingResults({ children }: { children: ReactNode }) {
  const query = useSearchParams().toString();
  const isUpdating = useNavigationStore((state) => state.isUpdating);
  const setUpdating = useNavigationStore((state) => state.setUpdating);

  // The URL only changes once the new results have arrived, so a new query means we're done
  useEffect(() => {
    if (query !== null) setUpdating(false);
  }, [query, setUpdating]);

  return (
    <div className="relative" aria-busy={isUpdating}>
      {isUpdating && (
        <output className="absolute inset-x-0 top-0 z-10 flex justify-center">
          <span className="mt-16 flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium shadow-lg">
            <Spinner /> Updating results…
          </span>
        </output>
      )}
      <div
        className={cn(
          "transition-opacity duration-200",
          isUpdating && "pointer-events-none opacity-50",
        )}
      >
        {children}
      </div>
    </div>
  );
}
