import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/shared/motion/reveal";
import SectionHeading from "@/components/shared/section-heading";

const QUESTIONS = [
  {
    question: "Is it free to search and apply?",
    answer:
      "Yes. Creating an account, searching, requesting viewings and applying are free. You only pay the rent for a room you've been approved for.",
  },
  {
    question: "What happens after I apply for a room?",
    answer:
      "The owner reviews your application and approves or rejects it. Pending applications expire after 7 days, so you're never left waiting forever.",
  },
  {
    question: "Can two people be approved for the same room?",
    answer:
      "No. When an owner approves an application, the room is reserved for that tenant and other requests for it are closed.",
  },
  {
    question: "How does paying rent work?",
    answer:
      "Rent is paid by card through Stripe's secure checkout. Your rental becomes active once the first payment succeeds, and every payment has a downloadable receipt.",
  },
  {
    question: "When does a roommate see my phone number?",
    answer:
      "Only after you both accept a connection request. Until then, they see your roommate profile but not your contact details.",
  },
];

export default function FaqPreview() {
  return (
    <section className="border-t bg-muted/40 py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.5fr] lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Questions"
            title="Good to know before you move"
            description="Short answers to what tenants and owners ask most."
          />
          <Link
            href="/faq"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Read all FAQs
            <ArrowRight className="size-4" />
          </Link>
        </Reveal>

        <Reveal delay={0.15} className="divide-y rounded-3xl border bg-card">
          {QUESTIONS.map(({ question, answer }) => (
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
        </Reveal>
      </div>
    </section>
  );
}
