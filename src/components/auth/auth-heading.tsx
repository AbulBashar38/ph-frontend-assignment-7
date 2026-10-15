import type { ReactNode } from "react";
import Reveal from "@/components/shared/motion/reveal";

// Title + subtitle at the top of every auth form
export default function AuthHeading({
  title,
  description,
}: {
  title: string;
  description: ReactNode;
}) {
  return (
    <Reveal y={16} className="space-y-2">
      <h1 className="font-heading text-3xl font-bold tracking-tight">
        {title}
      </h1>
      <p className="text-muted-foreground">{description}</p>
    </Reveal>
  );
}
