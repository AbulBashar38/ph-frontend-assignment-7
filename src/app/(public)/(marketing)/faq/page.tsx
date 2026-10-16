import { MessageCircleQuestion } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import FaqList from "@/components/shared/faq-list";
import Reveal from "@/components/shared/motion/reveal";
import PageHeader from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { FAQ_GROUPS } from "@/content/faq";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description:
    "How viewings, applications, rent payments, roommate matching and owner listings work on BariBasa.",
  openGraph: {
    title: "FAQ | BariBasa",
    description:
      "Answers about viewings, applications, paying rent online, roommate matching and listing a property.",
    url: "/faq",
  },
};

// Lets search engines show the answers directly in results
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_GROUPS.flatMap((group) =>
    group.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  ),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON built from our own content
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <PageHeader
        eyebrow="Help"
        title="Frequently asked questions"
        description="How renting, paying, finding roommates and listing a property work here."
        breadcrumbs={[{ label: "FAQ" }]}
      />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[14rem_1fr] lg:px-8">
        <nav
          aria-label="FAQ topics"
          className="lg:sticky lg:top-24 lg:self-start"
        >
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            {FAQ_GROUPS.map((group) => (
              <li key={group.id}>
                <a
                  href={`#${group.id}`}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {group.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-12">
          {FAQ_GROUPS.map((group) => (
            <Reveal key={group.id}>
              <section
                id={group.id}
                aria-labelledby={`${group.id}-title`}
                className="scroll-mt-28 space-y-4"
              >
                <h2
                  id={`${group.id}-title`}
                  className="font-heading text-2xl font-semibold"
                >
                  {group.title}
                </h2>
                <FaqList items={group.items} />
              </section>
            </Reveal>
          ))}

          <div className="flex flex-col items-center gap-4 rounded-3xl bg-accent/60 p-8 text-center">
            <MessageCircleQuestion className="size-8 text-primary" />
            <div>
              <p className="font-heading text-xl font-semibold">
                Still have a question?
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Send us a message and we&apos;ll get back to you.
              </p>
            </div>
            <Link href="/contact" className={buttonVariants()}>
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
