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
  action,
  children,
  className,
}: {
  title: string;
  description?: ReactNode;
  // A button in the header (when there's no href)
  action?: ReactNode;
  href?: string;
  linkLabel?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border bg-card", className)}>
      <div className="flex items-center justify-between gap-3 border-b px-5 py-4">
        <div>
          <h2 className="font-heading text-base font-semibold">{title}</h2>
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {action && !href && <div className="shrink-0">{action}</div>}
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
