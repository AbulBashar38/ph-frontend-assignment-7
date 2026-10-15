import { SearchX } from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";

export default function PropertyNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <EmptyState
        icon={SearchX}
        title="This property isn't available"
        description="It may have been taken down by the owner, or the link is wrong."
        action={
          <Link href="/properties" className={buttonVariants()}>
            Browse all properties
          </Link>
        }
      />
    </div>
  );
}
