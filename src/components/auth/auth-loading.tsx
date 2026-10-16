import { Spinner } from "@/components/ui/spinner";

// Full-screen state while the session is being checked
export default function AuthLoading({
  label = "Checking your account",
}: {
  label?: string;
}) {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <p className="flex items-center gap-3 text-sm text-muted-foreground">
        <Spinner className="size-5" />
        {label}
      </p>
    </div>
  );
}
