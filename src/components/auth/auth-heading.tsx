import type { ReactNode } from "react";

// Title + subtitle at the top of every auth form
export default function AuthHeading({
  title,
  description,
}: {
  title: string;
  description: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h1 className="font-heading text-3xl font-bold tracking-tight">
        {title}
      </h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
