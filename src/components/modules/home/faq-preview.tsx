import { ArrowRight } from "lucide-react";
import Link from "next/link";
import FaqList from "@/components/shared/faq-list";
import Reveal from "@/components/shared/motion/reveal";
import SectionHeading from "@/components/shared/section-heading";
import { FAQ_HIGHLIGHTS } from "@/content/faq";

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

        <Reveal delay={0.15}>
          <FaqList items={FAQ_HIGHLIGHTS} />
        </Reveal>
      </div>
    </section>
  );
}
