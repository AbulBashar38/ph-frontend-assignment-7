import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

// Footer of a form: an optional secondary action (Back, Cancel) and the submit button
export default function FormActions({
  submitLabel,
  pendingLabel = "Saving",
  pending = false,
  icon,
  secondary,
  variant = "default",
}: {
  submitLabel: string;
  pendingLabel?: string;
  pending?: boolean;
  icon?: ReactNode;
  secondary?: ReactNode;
  variant?: "default" | "destructive";
}) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
      <div>{secondary}</div>
      <Button
        type="submit"
        variant={variant}
        disabled={pending}
        className="sm:min-w-44"
      >
        {pending ? (
          <>
            <Spinner /> {pendingLabel}
          </>
        ) : (
          <>
            {submitLabel}
            {icon}
          </>
        )}
      </Button>
    </div>
  );
}
