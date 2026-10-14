import { ArrowRight, Building2, KeyRound } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/shared/motion/reveal";
import SectionHeading from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";
import JourneySteps from "./journey-steps";

const JOURNEYS = [
  {
    key: "tenant",
    icon: KeyRound,
    title: "Looking for a place",
    cta: { label: "Find a home", href: "/properties" },
    steps: [
      {
        title: "Search and shortlist",
        text: "Filter by area, rent, room type, amenities and move-in date.",
      },
      {
        title: "Request a viewing",
        text: "Pick a time; the owner approves, reschedules or declines.",
      },
      {
        title: "Apply for a room",
        text: "Send one application and follow its status from your dashboard.",
      },
      {
        title: "Pay rent online",
        text: "Once approved, pay securely through Stripe and get a PDF receipt.",
      },
    ],
  },
  {
    key: "owner",
    icon: Building2,
    title: "Renting out space",
    cta: { label: "List your property", href: "/register" },
    steps: [
      {
        title: "List the property",
        text: "Add photos, amenities and each room with its own rent.",
      },
      {
        title: "Handle viewings",
        text: "Approve, reschedule or complete viewing requests in one list.",
      },
      {
        title: "Choose your tenant",
        text: "Review applications and approve one; the room is reserved for them.",
      },
      {
        title: "Track rent and rooms",
        text: "See payments, active rentals and which rooms are occupied.",
      },
    ],
  },
];

export default function JourneySection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="How it works"
            title="One platform, both sides of the lease"
            description="Tenants and owners follow the same clear steps, so everyone always knows what happens next."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {JOURNEYS.map(({ key, icon: Icon, title, cta, steps }, index) => (
            <Reveal key={key} delay={index * 0.15} className="flex">
              <div
                className={cn(
                  "flex w-full flex-col rounded-3xl border p-6 transition-shadow hover:shadow-xl hover:shadow-primary/5 sm:p-8",
                  key === "tenant" ? "bg-card" : "bg-secondary/60",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="font-heading text-2xl font-semibold">
                    {title}
                  </h3>
                </div>

                <JourneySteps steps={steps} />

                <Link
                  href={cta.href}
                  className="inline-flex items-center gap-2 self-start text-sm font-semibold text-primary hover:underline"
                >
                  {cta.label}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
