import { Badge } from "@/components/ui/badge";
import { formatEnum } from "@/utils";

type Tone = "positive" | "warning" | "muted" | "destructive";

// One colour language for every status in the app (rooms, properties, viewings, applications, payments…)
const STATUS_TONES: Record<string, Tone> = {
  AVAILABLE: "positive",
  PUBLISHED: "positive",
  ACTIVE: "positive",
  APPROVED: "positive",
  PAID: "positive",
  COMPLETED: "positive",
  ACCEPTED: "positive",
  RESERVED: "warning",
  PENDING: "warning",
  RESCHEDULED: "warning",
  DRAFT: "warning",
  OCCUPIED: "muted",
  INACTIVE: "muted",
  UNAVAILABLE: "muted",
  MAINTENANCE: "muted",
  CANCELLED: "muted",
  EXPIRED: "muted",
  ARCHIVED: "muted",
  REJECTED: "destructive",
  DECLINED: "destructive",
  FAILED: "destructive",
  SUSPENDED: "destructive",
  BLOCKED: "destructive",
  TERMINATED: "destructive",
};

export default function StatusBadge({
  status,
  size = "sm",
  className,
}: {
  status: string;
  size?: "sm" | "default";
  className?: string;
}) {
  const tone = STATUS_TONES[status] ?? "muted";

  return (
    <Badge variant={tone} size={size} className={className}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {formatEnum(status)}
    </Badge>
  );
}
