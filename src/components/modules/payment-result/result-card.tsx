import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const TONES = {
  success: "bg-accent text-primary",
  waiting: "bg-highlight/20 text-highlight-foreground",
  muted: "bg-muted text-muted-foreground",
  danger: "bg-destructive/10 text-destructive",
};

// The centred card both payment result pages use
export default function ResultCard({
  icon: Icon,
  tone,
  title,
  description,
  children,
  actions,
}: {
  icon: LucideIcon;
  tone: keyof typeof TONES;
  title: string;
  description: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section
      aria-live="polite"
      className="mx-auto flex max-w-lg flex-col items-center gap-6 rounded-3xl border bg-card p-6 text-center shadow-xs sm:p-10"
    >
      <span
        className={cn(
          "flex size-16 items-center justify-center rounded-2xl",
          TONES[tone],
        )}
      >
        <Icon className="size-8" />
      </span>
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-bold sm:text-3xl">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {children}
      {actions && (
        <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          {actions}
        </div>
      )}
    </section>
  );
}
