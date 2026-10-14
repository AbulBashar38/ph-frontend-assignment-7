import { ArrowRight, Filter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import roommatesImage from "@/assets/images/roommates.jpg";
import CountUp from "@/components/shared/motion/count-up";
import GrowBar from "@/components/shared/motion/grow-bar";
import Parallax from "@/components/shared/motion/parallax";
import Reveal from "@/components/shared/motion/reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Same weights as the backend's matcher (roommate.constant.ts → MATCH_WEIGHTS, total 100)
const FACTORS = [
  { label: "Budget overlap", weight: 25 },
  { label: "Preferred area", weight: 20 },
  { label: "Move-in date", weight: 15 },
  { label: "Lifestyle tags", weight: 10 },
  { label: "Smoking", weight: 10 },
  { label: "Pets", weight: 10 },
  { label: "Sleep schedule", weight: 10 },
];

const MAX_WEIGHT = 25;

export default function RoommateSection() {
  return (
    <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground sm:py-28 dark:bg-accent dark:text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-highlight/20 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <Reveal>
            <p className="text-sm font-semibold tracking-wide text-highlight uppercase">
              Roommate matching
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-3 font-heading text-3xl leading-tight font-bold tracking-tight text-balance sm:text-5xl">
              Share a flat with someone who lives like you do.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-5 max-w-xl text-lg leading-relaxed opacity-85 text-pretty">
              Create a roommate profile with your budget, area, move-in date and
              habits. We score every other profile out of 100, and contact
              details are only shared once both of you accept a connection
              request.
            </p>
          </Reveal>

          <Reveal delay={0.3} className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 gap-2 bg-highlight px-5 text-highlight-foreground hover:bg-highlight/90",
              )}
            >
              Create a roommate profile
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/rooms?roomType=SHARED"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "h-11 border-current/30 bg-transparent px-5 text-current hover:bg-current/10 hover:text-current",
              )}
            >
              Browse shared rooms
            </Link>
          </Reveal>
        </div>

        <div className="relative">
          <Parallax offset={40}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl lg:ml-28 lg:aspect-[4/5]">
              <Image
                src={roommatesImage}
                alt="Four flatmates chatting around a table"
                fill
                placeholder="blur"
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-[50%_25%]"
              />
            </div>
          </Parallax>

          <Reveal
            delay={0.15}
            y={50}
            className="relative -mt-20 mx-3 rounded-3xl bg-background p-6 text-foreground shadow-2xl sm:mx-8 sm:p-7 lg:absolute lg:-bottom-10 lg:left-0 lg:m-0 lg:w-[24rem]"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-heading text-lg font-semibold">
                  How a match score is built
                </p>
                <p className="text-sm text-muted-foreground">
                  Seven factors, 100 points in total
                </p>
              </div>
              <CountUp
                value={100}
                className="font-heading text-4xl font-bold text-primary tabular-nums"
              />
            </div>

            <ul className="mt-5 space-y-3">
              {FACTORS.map(({ label, weight }, index) => (
                <li
                  key={label}
                  className="grid grid-cols-[7.5rem_1fr_2rem] items-center gap-3 text-sm"
                >
                  <span className="font-medium">{label}</span>
                  <span className="h-2 overflow-hidden rounded-full bg-muted">
                    <GrowBar
                      percent={(weight / MAX_WEIGHT) * 100}
                      delay={0.2 + index * 0.08}
                      className="block h-full rounded-full bg-primary"
                    />
                  </span>
                  <span className="text-right font-semibold tabular-nums text-muted-foreground">
                    {weight}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-5 flex items-start gap-2 rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
              <Filter className="mt-0.5 size-3.5 shrink-0 text-primary" />
              Gender preference isn&apos;t scored: it&apos;s a hard filter, so
              you only see profiles that fit it.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
