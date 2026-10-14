import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        align === "center"
          ? "items-center text-center"
          : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          {eyebrow}
        </p>
        <h2 className="mt-3 font-heading text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
