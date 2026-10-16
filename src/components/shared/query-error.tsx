"use client";

import { RefreshCw, ServerCrash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/utils";
import EmptyState from "./empty-state";

// Shown in place of a list whose request failed, with the backend's reason and a retry
export default function QueryError({
  error,
  onRetry,
  title = "We couldn't load this list",
}: {
  error: unknown;
  onRetry: () => void;
  title?: string;
}) {
  return (
    <EmptyState
      icon={ServerCrash}
      title={title}
      description={getErrorMessage(error)}
      action={
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw />
          Try again
        </Button>
      }
    />
  );
}
