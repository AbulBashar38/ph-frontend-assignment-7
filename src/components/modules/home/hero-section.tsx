import { CalendarCheck, CreditCard, FileCheck2 } from "lucide-react";
import Reveal from "@/components/shared/motion/reveal";
import type { Property } from "@/types";
import HeroHeadline from "./hero-headline";
import HeroSearch from "./hero-search";
import HeroShowcase from "./hero-showcase";

const PROMISES = [
  { icon: CalendarCheck, label: "Owner-approved viewings" },
  { icon: FileCheck2, label: "Applications tracked live" },
  { icon: CreditCard, label: "Rent paid via Stripe" },
];

export default function HeroSection({
  properties,
}: {
  properties: Property[];
}) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_85%_10%,color-mix(in_oklch,var(--highlight)_22%,transparent),transparent),radial-gradient(50%_60%_at_0%_100%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(70%_60%_at_30%_30%,black,transparent)] bg-[size:56px_56px] opacity-40"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pt-12 pb-20 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:px-8 lg:pt-20 lg:pb-28">
        <div>
          <Reveal y={12}>
            <p className="inline-flex items-center gap-2 text-sm font-medium text-primary">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-highlight opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-highlight" />
              </span>
              Homes &amp; roommates across Bangladesh
            </p>
          </Reveal>

          <HeroHeadline />

          <Reveal delay={0.55}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
              Search verified flats and rooms, match with roommates by budget,
              area and lifestyle, then book a viewing, apply and pay rent, all
              in one place.
            </p>
          </Reveal>

          <Reveal delay={0.7} className="mt-9 max-w-2xl">
            <HeroSearch />
          </Reveal>

          <Reveal delay={0.85}>
            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
              {PROMISES.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2">
                  <Icon className="size-4 text-primary" />
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <HeroShowcase properties={properties} />
      </div>
    </section>
  );
}
