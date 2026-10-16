import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// One headline number on a dashboard; links to its list when `href` is set
export default function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  href,
  loading = false,
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  href?: string;
  loading?: boolean;
}) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className="flex size-9 items-center justify-center rounded-xl bg-accent text-primary">
          <Icon className="size-4" />
        </span>
      </div>
      {loading ? (
        <Skeleton className="mt-3 h-8 w-20" />
      ) : (
        <p className="mt-2 font-heading text-3xl font-bold tabular-nums">
          {value}
        </p>
      )}
      {hint && !loading && (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      )}
    </>
  );

  const className = "rounded-2xl border bg-card p-5";

  return href ? (
    <Link
      href={href}
      className={cn(
        className,
        "transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
      )}
    >
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}
