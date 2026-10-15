import { Building2 } from "lucide-react";
import Link from "next/link";

// Static stand-in for the header on pages whose URL is only known per request; same size, so nothing shifts
export default function HeaderFallback() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Building2 className="size-5" />
          </span>
          <span className="font-heading text-xl font-bold tracking-tight">
            Bari<span className="text-primary">Basa</span>
          </span>
        </Link>
      </div>
    </header>
  );
}
