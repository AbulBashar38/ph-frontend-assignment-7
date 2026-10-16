"use client";

import { RefreshCw, ServerCrash } from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/shared/empty-state";
import { Button, buttonVariants } from "@/components/ui/button";

// Last boundary inside the root layout, for errors no segment caught
export default function RootError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 items-center px-4 py-20">
      <EmptyState
        className="w-full"
        icon={ServerCrash}
        title="Something went wrong"
        description="We hit an unexpected error. Please try again in a moment."
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
    </main>
  );
}
