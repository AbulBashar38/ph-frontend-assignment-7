import { Home, MapPinOff, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import EmptyState from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 items-center px-4 py-20">
      <EmptyState
        className="w-full"
        icon={MapPinOff}
        title="We couldn't find that page"
        description="The link may be broken, or the page may have moved. Try searching for a place to live instead."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/properties" className={buttonVariants()}>
              <Search />
              Browse properties
            </Link>
            <Link href="/" className={buttonVariants({ variant: "outline" })}>
              <Home />
              Go home
            </Link>
          </div>
        }
      />
    </main>
  );
}
