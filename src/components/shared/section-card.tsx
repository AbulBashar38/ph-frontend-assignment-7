import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// A titled panel on a dashboard, optionally linking to the full list
export default function SectionCard({
  title,
  description,
  href,
  linkLabel = "View all",
  children,
  className,
}: {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border bg-card", className)}>
      <div className="flex items-start justify-between gap-3 border-b px-5 py-4">
        <div>
          <h2 className="font-heading text-base font-semibold">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {href && (
          <Link
            href={href}
            className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {linkLabel}
            <ArrowRight className="size-3.5" />
          </Link>
        )}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
