import { Plus } from "lucide-react";
import type { FaqItem } from "@/content/faq";

// Accordion of questions built on <details>, so it works without JavaScript
export default function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y rounded-3xl border bg-card">
      {items.map(({ question, answer }) => (
        <details key={question} className="group px-6 py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
            {question}
            <Plus className="size-4 shrink-0 text-primary transition-transform group-open:rotate-45" />
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {answer}
          </p>
        </details>
      ))}
    </div>
  );
}
