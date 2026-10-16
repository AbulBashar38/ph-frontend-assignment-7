import type { ReactNode } from "react";
import StatusBadge from "@/components/shared/status-badge";

// One line in an overview list: what, where, when, status
export default function ActivityRow({
  title,
  subtitle,
  meta,
  status,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  meta?: ReactNode;
  status: string;
}) {
  return (
    <li className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="truncate font-medium">{title}</p>
        {subtitle && (
          <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
        )}
        {meta && <p className="mt-0.5 text-xs text-muted-foreground">{meta}</p>}
      </div>
      <StatusBadge status={status} className="shrink-0" />
    </li>
  );
}
