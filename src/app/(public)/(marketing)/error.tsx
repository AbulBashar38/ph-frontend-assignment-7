"use client";

import { RefreshCw, ServerCrash } from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/shared/empty-state";
import { Button, buttonVariants } from "@/components/ui/button";

// Shown when a public page fails to load (for example the API is unreachable)
export default function MarketingError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <EmptyState
        icon={ServerCrash}
        title="We couldn't load this page"
        description="Something went wrong on our side. Please try again in a moment."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={reset}>
              <RefreshCw />
              Try again
            </Button>
            <Link href="/" className={buttonVariants({ variant: "outline" })}>
              Go home
            </Link>
          </div>
        }
      />
    </div>
  );
}
