import { cn } from "@/lib/utils";

const SIZES = {
  // Cards: small ring, label underneath
  sm: { ring: "size-14", number: "text-base", label: "text-[11px]" },
  // Profile page
  lg: { ring: "size-24", number: "text-2xl", label: "text-sm" },
};

// Score out of 100 in a ring, coloured by how good the fit is, with its label underneath
export default function CompatibilityScore({
  score,
  label,
  size = "sm",
}: {
  score: number;
  label: string;
  size?: keyof typeof SIZES;
}) {
  const tone =
    score >= 75
      ? "text-primary"
      : score >= 50
        ? "text-highlight-foreground"
        : "text-muted-foreground";
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const classes = SIZES[size];

  return (
    <div className="flex shrink-0 flex-col items-center gap-1 text-center">
      <div
        className={cn("relative", classes.ring)}
        role="img"
        aria-label={`${score} out of 100: ${label}`}
      >
        <svg
          viewBox="0 0 64 64"
          aria-hidden="true"
          className="size-full -rotate-90"
        >
          <circle
            cx="32"
            cy="32"
            r={radius}
            className="fill-none stroke-muted"
            strokeWidth="6"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            className={cn("fill-none stroke-current", tone)}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - score / 100)}
          />
        </svg>
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center font-heading font-bold tabular-nums",
            classes.number,
          )}
        >
          {score}
        </span>
      </div>
      <p
        className={cn(
          "max-w-24 leading-tight font-semibold",
          tone,
          classes.label,
        )}
      >
        {label}
      </p>
    </div>
  );
}
