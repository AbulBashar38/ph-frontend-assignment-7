import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";

export default function AccessDenied({ homeHref }: { homeHref: string }) {
  return (
    <div className="flex min-h-svh items-center justify-center px-4">
      <EmptyState
        icon={ShieldAlert}
        title="You don't have access to this page"
        description="This area belongs to another type of account."
        action={
          <Link href={homeHref} className={buttonVariants()}>
            Go to your dashboard
          </Link>
        }
        className="max-w-lg"
      />
    </div>
  );
}
