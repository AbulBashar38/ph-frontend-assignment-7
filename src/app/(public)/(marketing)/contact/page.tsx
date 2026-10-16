import {
  ArrowRight,
  Building2,
  CircleHelp,
  KeyRound,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import ContactForm from "@/components/form/contact-form";
import Reveal from "@/components/shared/motion/reveal";
import PageHeader from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Questions about renting, listing a property or your account? Send the BariBasa team a message.",
  openGraph: {
    title: "Contact BariBasa",
    description:
      "Send the team a message about renting, listing a property or your account.",
    url: "/contact",
  },
};

const SHORTCUTS: {
  icon: LucideIcon;
  title: string;
  text: string;
  href: string;
}[] = [
  {
    icon: CircleHelp,
    title: "Read the FAQ",
    text: "Viewings, applications, payments and roommates explained.",
    href: "/faq",
  },
  {
    icon: KeyRound,
    title: "Looking for a place?",
    text: "Browse rooms with real rent and move-in dates.",
    href: "/rooms",
  },
  {
    icon: Building2,
    title: "Want to list a property?",
    text: "Create a free owner account and publish your rooms.",
    href: "/register",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="We'd love to hear from you"
        description="Questions about renting, listing a property or your account? Send us a message and the team will reply by email."
        breadcrumbs={[{ label: "Contact" }]}
      />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_22rem] lg:px-8 lg:py-16">
        <Reveal>
          <section
            aria-labelledby="contact-form-title"
            className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8"
          >
            <h2
              id="contact-form-title"
              className="font-heading text-2xl font-semibold"
            >
              Send a message
            </h2>
            <p className="mt-1 mb-6 text-sm text-muted-foreground">
              All fields are required. We reply to the email you enter.
            </p>
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <ContactForm />
            </Suspense>
          </section>
        </Reveal>

        <Reveal delay={0.15} className="space-y-3">
          <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Maybe faster
          </p>
          {SHORTCUTS.map(({ icon: Icon, title, text, href }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-start gap-3 rounded-2xl border bg-card p-4 transition-colors hover:border-primary/40"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                <Icon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1 font-semibold">
                  {title}
                  <ArrowRight className="size-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                </span>
                <span className="mt-0.5 block text-sm text-muted-foreground">
                  {text}
                </span>
              </span>
            </Link>
          ))}
        </Reveal>
      </div>
    </>
  );
}
